import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chatbot } from '../components/Chatbot';

// AppContext mock
vi.mock('../context/AppContext', () => ({
  useAppContext: () => ({ logAction: vi.fn() }),
}));

const mockCreate = vi.fn();

vi.mock('groq-sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  })),
}));

function makeApiResponse(text) {
  return { choices: [{ message: { content: text } }] };
}

describe('Chatbot bileşeni', () => {
  beforeEach(() => {
    mockCreate.mockReset();
    vi.stubEnv('VITE_GROQ_API_KEY', 'test-api-key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('sohbet butonu başlangıçta görünür', () => {
    render(<Chatbot />);
    expect(screen.getByRole('button', { name: /🤖/i })).toBeInTheDocument();
  });

  it('butona tıklayınca chatbot paneli açılır', async () => {
    render(<Chatbot />);
    const toggleBtn = screen.getAllByRole('button')[0];
    await userEvent.click(toggleBtn);
    expect(screen.getByText('TrendSepet AI')).toBeInTheDocument();
  });

  it('açıkken tekrar tıklayınca panel kapanır', async () => {
    render(<Chatbot />);
    const toggleBtn = screen.getAllByRole('button')[0];
    await userEvent.click(toggleBtn);
    expect(screen.getByText('TrendSepet AI')).toBeInTheDocument();

    await userEvent.click(toggleBtn);
    expect(screen.queryByText('TrendSepet AI')).not.toBeInTheDocument();
  });

  it('panel açılınca karşılama mesajı gösterilir', async () => {
    render(<Chatbot />);
    await userEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.getByText(/Merhaba! Ben TrendSepet/i)).toBeInTheDocument();
  });

  it('mesaj gönderince kullanıcı mesajı listede görünür', async () => {
    mockCreate.mockResolvedValue(makeApiResponse('Bot cevabı'));
    render(<Chatbot />);
    await userEvent.click(screen.getAllByRole('button')[0]);

    const input = screen.getByPlaceholderText('Asistana bir şey sorun...');
    await userEvent.type(input, 'Koşu ayakkabısı önerir misin?');
    fireEvent.submit(input.closest('form'));

    expect(screen.getByText('Koşu ayakkabısı önerir misin?')).toBeInTheDocument();
  });

  it('API cevabı geldikten sonra bot mesajı görünür', async () => {
    mockCreate.mockResolvedValue(makeApiResponse('AeroStep Pro X2 çok popüler!'));
    render(<Chatbot />);
    await userEvent.click(screen.getAllByRole('button')[0]);

    const input = screen.getByPlaceholderText('Asistana bir şey sorun...');
    await userEvent.type(input, 'Ayakkabı öner');
    fireEvent.submit(input.closest('form'));

    await waitFor(() => {
      expect(screen.getByText('AeroStep Pro X2 çok popüler!')).toBeInTheDocument();
    });
  });

  it('gönderim sırasında "Yazıyor..." gösterilir ve sonra kaybolur', async () => {
    let resolve;
    mockCreate.mockReturnValue(new Promise(r => { resolve = r; }));

    render(<Chatbot />);
    await userEvent.click(screen.getAllByRole('button')[0]);

    const input = screen.getByPlaceholderText('Asistana bir şey sorun...');
    await userEvent.type(input, 'test');
    fireEvent.submit(input.closest('form'));

    expect(screen.getByText('Yazıyor...')).toBeInTheDocument();

    resolve(makeApiResponse('Cevap geldi'));
    await waitFor(() => {
      expect(screen.queryByText('Yazıyor...')).not.toBeInTheDocument();
    });
  });

  it('API hatası durumunda hata mesajı gösterilir', async () => {
    mockCreate.mockRejectedValue(new Error('Network error'));
    render(<Chatbot />);
    await userEvent.click(screen.getAllByRole('button')[0]);

    const input = screen.getByPlaceholderText('Asistana bir şey sorun...');
    await userEvent.type(input, 'merhaba');
    fireEvent.submit(input.closest('form'));

    await waitFor(() => {
      expect(screen.getByText(/şu an bağlantımda bir sorun/i)).toBeInTheDocument();
    });
  });

  it('API key hatası durumunda özel mesaj gösterilir', async () => {
    mockCreate.mockRejectedValue(new Error('401 invalid api key'));
    render(<Chatbot />);
    await userEvent.click(screen.getAllByRole('button')[0]);

    const input = screen.getByPlaceholderText('Asistana bir şey sorun...');
    await userEvent.type(input, 'merhaba');
    fireEvent.submit(input.closest('form'));

    await waitFor(() => {
      expect(screen.getByText(/API anahtarı geçersiz/i)).toBeInTheDocument();
    });
  });

  it('boş mesaj gönderilince hiçbir şey olmaz', async () => {
    render(<Chatbot />);
    await userEvent.click(screen.getAllByRole('button')[0]);

    const form = screen.getByPlaceholderText('Asistana bir şey sorun...').closest('form');
    fireEvent.submit(form);

    expect(mockCreate).not.toHaveBeenCalled();
  });

  describe('API key olmadığında simülasyon modu', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_GROQ_API_KEY', '');
    });

    it('simülasyon uyarısı gösterilir', async () => {
      render(<Chatbot />);
      await userEvent.click(screen.getAllByRole('button')[0]);
      expect(screen.getByText(/Simülasyon Modu/i)).toBeInTheDocument();
    });

    it('"kargo" sorusuna simülasyon cevabı verilir', async () => {
      render(<Chatbot />);
      await userEvent.click(screen.getAllByRole('button')[0]);

      const input = screen.getByPlaceholderText('Asistana bir şey sorun...');
      await userEvent.type(input, 'kargo ne zaman gelir?');
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(screen.getByText(/24 saat içerisinde/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('"iade" sorusuna simülasyon cevabı verilir', async () => {
      render(<Chatbot />);
      await userEvent.click(screen.getAllByRole('button')[0]);

      const input = screen.getByPlaceholderText('Asistana bir şey sorun...');
      await userEvent.type(input, 'iade nasıl yapılır?');
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(screen.getByText(/14 gün/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('"merhaba" mesajına karşılama cevabı verilir', async () => {
      render(<Chatbot />);
      await userEvent.click(screen.getAllByRole('button')[0]);

      const input = screen.getByPlaceholderText('Asistana bir şey sorun...');
      await userEvent.type(input, 'merhaba');
      fireEvent.submit(input.closest('form'));

      await waitFor(() => {
        expect(screen.getByText(/Alışveriş rehberiniz/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });
});

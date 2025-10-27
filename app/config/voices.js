/**
 * Voice Configuration for TTS
 * Based on SE-TTS Proxy Kokoro voices
 * ⭐⭐⭐ = Muito natural/humana (alta qualidade)
 * ⭐⭐ = Boa qualidade
 * ⭐ = Qualidade básica
 */

export const VOICE_CONFIG = {
  'pt-BR': 'pf_dora',    // Portuguese Female ⭐⭐⭐ (best quality)
  'en': 'am_michael',    // American English Male ⭐⭐⭐ (high quality - default)
};

// Alternative voices by language
export const AVAILABLE_VOICES = {
  'pt-BR': [
    { value: 'pf_dora', label: 'Dora (Feminino) ⭐⭐⭐', gender: 'female' },
    { value: 'pm_alex', label: 'Alex (Masculino) ⭐⭐', gender: 'male' },
    { value: 'pm_santa', label: 'Santa (Masculino) ⭐⭐', gender: 'male' },
  ],
  'en': [
    { value: 'af_sarah', label: 'Sarah (Female) ⭐⭐⭐', gender: 'female' },
    { value: 'af_bella', label: 'Bella (Female) ⭐⭐⭐', gender: 'female' },
    { value: 'af_nicole', label: 'Nicole (Female) ⭐⭐⭐', gender: 'female' },
    { value: 'af_nova', label: 'Nova (Female) ⭐⭐⭐', gender: 'female' },
    { value: 'af_sky', label: 'Sky (Female) ⭐⭐⭐', gender: 'female' },
    { value: 'am_michael', label: 'Michael (Male) ⭐⭐⭐', gender: 'male' },
    { value: 'am_adam', label: 'Adam (Male) ⭐⭐', gender: 'male' },
  ],
};

export const TTS_API_TOKEN = process.env.TTS_API_TOKEN;


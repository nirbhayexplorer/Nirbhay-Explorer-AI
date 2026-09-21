import { useCallback, useEffect, useRef, useState } from "react";

// Prefers Microsoft's "Online (Natural)" neural voices — available in
// Microsoft Edge — and falls back gracefully to whatever voice the
// browser exposes elsewhere (spec section 15).
function pickDefaultVoice(list) {
  return (
    list.find((v) => /Microsoft/i.test(v.name) && /Online/i.test(v.name) && /Natural/i.test(v.name) && /^en/i.test(v.lang)) ||
    list.find((v) => /Microsoft/i.test(v.name) && /Online/i.test(v.name) && /^en/i.test(v.lang)) ||
    list.find((v) => /Microsoft/i.test(v.name) && /^en/i.test(v.lang)) ||
    list.find((v) => v.default) ||
    list[0]
  );
}

export function useReadAloud({ rate = 1, pitch = 1, volume = 1, voiceName } = {}) {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const [voices, setVoices] = useState([]);
  const [speakingId, setSpeakingId] = useState(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!supported) return;
    function load() {
      const list = window.speechSynthesis.getVoices();
      if (list.length) setVoices(list);
    }
    load();
    window.speechSynthesis.onvoiceschanged = load;
    const t1 = setTimeout(load, 300);
    return () => clearTimeout(t1);
  }, [supported]);

  const speak = useCallback(
    (id, text) => {
      if (!supported || !text) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      const chosen = voiceName ? voices.find((v) => v.name === voiceName) : pickDefaultVoice(voices);
      if (chosen) { utter.voice = chosen; utter.lang = chosen.lang; }
      utter.rate = rate;
      utter.pitch = pitch;
      utter.volume = volume;
      utter.onstart = () => setSpeakingId(id);
      utter.onend = () => setSpeakingId((cur) => (cur === id ? null : cur));
      utter.onerror = () => setSpeakingId((cur) => (cur === id ? null : cur));
      utteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
    },
    [supported, voices, voiceName, rate, pitch, volume]
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, [supported]);

  useEffect(() => () => { if (supported) window.speechSynthesis.cancel(); }, [supported]);

  return { supported, voices, speakingId, speak, stop };
}

class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.sampleRateIn = 48000;
    this.sampleRateOut = 16000;
    this.buffer = [];
    this.samplesPerChunk = 3200; // 200ms of audio at 16kHz, 16-bit = 3200 bytes
  }

  process(inputs) {
    const input = inputs[0];
    console.log('Input length:', input.length); // 🔍 Debug log

    if (!input.length || input[0].length === 0) {
      console.log('⚠️ No audio input detected'); // 🔍 Debug log
      return true;
    }

    const inputChannel = input[0];
    const downsampled = this.downsample(inputChannel, this.sampleRateIn, this.sampleRateOut);
    const int16 = this.floatTo16BitPCM(downsampled);

    this.buffer.push(...int16);

    while (this.buffer.length >= this.samplesPerChunk / 2) { // 3200 bytes = 1600 samples
      const chunk = new Int16Array(this.buffer.splice(0, this.samplesPerChunk / 2));
      const uint8Chunk = new Uint8Array(chunk.buffer); // Send raw bytes (Little Endian)
      this.port.postMessage(uint8Chunk.buffer);
    }

    return true;
  }

  downsample(buffer, inRate, outRate) {
    const ratio = inRate / outRate;
    const outLength = Math.floor(buffer.length / ratio);
    const output = new Float32Array(outLength);
    for (let i = 0; i < outLength; i++) {
      output[i] = buffer[Math.floor(i * ratio)];
    }
    return output;
  }

  floatTo16BitPCM(buffer) {
    const output = new Int16Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      let s = Math.max(-1, Math.min(1, buffer[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
  }
}

registerProcessor('pcm-processor', PCMProcessor);

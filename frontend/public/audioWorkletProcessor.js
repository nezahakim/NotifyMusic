class AudioProcessor extends AudioWorkletProcessor {
    process(inputs, outputs) {
      const input = inputs[0];
      const output = outputs[0];
  
      if (input && input[0]) {
        output[0].set(input[0]); // Directly pass audio data
      }
  
      return true; // Keep processing
    }
  }
  
  registerProcessor("audio-processor", AudioProcessor);
  
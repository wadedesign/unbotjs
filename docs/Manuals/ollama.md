## Ollama Downloader Usage Overview

As detailed in the [ollama usage documentation](docs/notUsed/ollama.js), we leverage the ollama OS LLM downloader and its API from the VPS (or whatever hosting solution you're utilizing). The performance of ollama can significantly vary depending on the system's hardware capabilities. In my case, lacking a GPU on my VPS, I resorted to CPU usage, which, while functional, resulted in slower performance.

### System Specifications

- **RAM:** 23GB (Note: Larger models could not be tested due to this limitation.)

### Tested Models

Below is a table of the LLM (Large Language Models) I've experimented with, using ollama:

| Model Name                 | Description                                    |
|----------------------------|------------------------------------------------|
| `gemma:7b`                 | -                                              |
| `llama2:13b`               | -                                              |
| `llama2-uncensored:latest` | Best performance in my testing; fast and efficient at retrieving information. |
| `mistral:latest`           | -                                              |

### Conclusions

Given my hardware constraints, particularly the lack of substantial RAM to support larger models, I found `llama2-uncensored:latest` to be the superior choice among the ones tested. It was the fastest, most responsive model, and exhibited excellent retrieval capabilities.

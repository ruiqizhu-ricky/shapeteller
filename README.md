# ShapeTeller


An LLM-powered vscode extension that **tells the shape of arrays and tensors** when hovering over a python variable. 

<img src="docs/images/example.png" width=500>

> [!CAUTION] 
> Since we make use of LLMs, the resulting shapes may not be accurate due to the inherent problem of [hallucination](https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)). If you feel doubtful about the result, or want to be 100% accurate, you'd better run the code and print the shapes.

> [!NOTE]
> This extension is considered to be completed. I will continue publishing new versions just to show that I keep an eye on it. If you have any proposals/problems, please open issues or pull requests, I will check them.

## Installation

Install from [VScode Extension Marketplace](https://marketplace.visualstudio.com/items?itemName=ruiqizhu-ricky.shapeteller)


## How to use

**Step 1**: choose your favorite platform and model (`shapeteller.platform.modelId`) and set the API key (`shapeteller.platform.apiKey`).

<img src="docs/images/platform-setting.png" width=600>

**Step 2**: Turn on the extension when you want to use from the command palette by typing `shapeteller: turn on`.

<img src="docs/images/turnon.png" width=600>

**Step 3**: Hover over a tensor/array variable to see its shape.

<img src="docs/images/example.png" width=600>

**Step 4**: Turn off the extension when you don't want to use it from the command palette by typing `shapeteller: turn off`, avoiding unnecessary API calls.

<img src="docs/images/turnoff.png" width=600>

### Use your own LLM

If you deployed your own model using [Ollama](https://github.com/ollama/ollama) or [vllm](https://github.com/vllm-project/vllm), *which support OpenAI-compatible API*, then you can use it as well. Just set the `shapeteller.customised.modelId` and `shapeteller.customised.apiEndpoint` in the settings. For example, if you run Ollama to serve a `phi3:mini` model, and your API endpoint is (by default) `http://localhost:11434/v1`:

<img src="docs/images/full-settings.png">

> [!NOTE]
> If you set your `shapeteller.customised.modelId` and `shapeteller.customised.apiEndpoint`, then the `shapeteller.platform.modelId` and `shapeteller.platform.apiKey` would be ignored. That says, the extension will prioritise your customised model over the commercial ones.

### General Settings

There are some more general settings, see the screenshot above.

### More information 

- [design note](docs/design-doc.md)

## Credits

- Idea directly brought by [@msaroufim](https://github.com/msaroufim/vscode-pytorch-extension)'s PyTorch extension.
- Extension icon created by <a href="https://www.flaticon.com/free-icons/matrix" title="matrix icons">Nadiinko - Flaticon</a>

# Change Log

All notable changes to the "shapeteller" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]

- add support for locally deployed model ([Ollama](https://github.com/ollama/ollama) and [vllm](https://github.com/vllm-project/vllm))
- create popup window for further user interaction with the model


## [0.3.0] - 2024.09.04 (4th Sept 2024)

- grouped the settings and reorder them

### Added
- add support for locally deployed model ([Ollama](https://github.com/ollama/ollama) and [vllm](https://github.com/vllm-project/vllm))


## [0.2.0] - 2024.09.04 (4th Sept 2024)

- switch `@types/vscode` from v1.92.0 to v1.91.0 to support the [current Cursor version](https://www.cursor.com/)

## [0.1.2] - 2024.09.04 (4th Sept 2024)

- move prompts related configs from `llm_client.ts` to `prompts.ts`

## [0.1.1] - 2024.09.04 (4th Sept 2024)

### Added
- Support `concise` mode vs `detail` mode in settings
- support `is_prefer_var` in settings


## [0.1.0] - 2024.09.04 (4th Sept 2024)

### Added
- developed the prompt manager module



## [0.0.2] - 2024.09.01 (1st Sept 2024)

> considering to use `langchain` etc. to make better prompts

Decided not to use `langchain` for now, since it looks too complicated for the current task, adding uncessary complexity for development and maintanence..


### Added

- User can set `maxToken` in settings
- Add support for Mistral
- Update `design-doc.md`


## [0.0.1] - 2024.08.30 (30 Aug 2024)

- Initial release
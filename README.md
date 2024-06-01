## ScriptOrchestrator: A Powerful Script Manager for Web Browsers [This is WIP]

**ScriptOrchestrator** is a JavaScript library designed to simplify and streamline script management within web browsers. It acts as a one-stop solution for loading and executing both inline and external scripts, offering a structured and efficient approach.

### Key Features

* **Sequential Script Loading:** ScriptOrchestrator ensures scripts are loaded and executed in a prioritized order. This prevents conflicts and guarantees scripts are loaded only after their dependencies are met.
* **Priority Management:** Scripts can be assigned different priority levels (Exceptional, High, Medium, Low) to control their execution order. Exceptional priority scripts execute immediately, while others are loaded based on their assigned priority.
* **Event-Driven Loading:** Scripts can be configured to load upon specific events triggered within your web application. This allows for dynamic script loading based on user interaction or application state.
* **Inline and External Script Support:** ScriptOrchestrator handles both inline JavaScript code snippets and external scripts referenced through URLs.
* **Flexible Script Configuration:** Customize script behavior by attaching attributes and defining timeouts for external scripts.

### Installation

**ScriptOrchestrator** can be installed via NPM:

```bash
Yet to update!
```

**Alternatively, you can use a CDN link:**

```
https://cdn.jsdelivr.net/gh/homeboy445/ScriptOrchestrator@main/release/bundle.js
```

### Usage

**ScriptOrchestrator** provides a user-friendly API for managing scripts. Here's a breakdown of its core functionalities:

**1. Initialization:**

```javascript
const scriptOrch = require('...'); // For NPM users

const mainInitConfig = scriptOrch.default();
```

This code initializes the ScriptOrchestrator instance and creates a configuration object for script management.

**2. Adding Scripts:**

* **External Script:**

```javascript
mainInitConfig.scripts.add().src("path/to/your/script.js");
```

This adds an external script to the queue, specifying its URL via the `src` method.

* **Inline Script:**

```javascript
mainInitConfig.scripts.add().inlineCode("console.log('Inline Script Executed!')");
```

This adds an inline script containing the provided JavaScript code string using the `inlineCode` method. You can also pass a function as an argument.

**3. Configuring Scripts (Optional):**

The `add` method allows for additional configuration options:

* `attr`: An object containing HTML attributes to be attached to the script tag.
* `priority`: A priority level (0: Exceptional, 1: High, 2: Medium, 3: Low) to define the script's execution order.
* `timeout`: A timeout value (in milliseconds) to specify the waiting time between loading consecutive external scripts.

**4. Attaching Event Listeners (Optional):**

Scripts can be configured to trigger event listeners upon specific events:

```javascript
mainInitConfig.scripts.add().src("path/to/your/script.js").listen("load");
```

This attaches a `load` event listener to the script being added. You can customize the event name and optionally define a custom event handler.

**5. Running the ScriptOrchestrator:**

```javascript
mainInitConfig.run();
```

This command initiates the script execution process based on the defined configuration and priority levels.

### Advanced Configuration

* **Stateful Mode:** By default, ScriptOrchestrator maintains an internal queue for script data. To disable this behavior and manage scripts externally, set the `stateFull` property to `false` during initialization:

```javascript
const mainInitConfig = scriptOrch.default({ stateFull: false });
```

### API Reference

This section provides a detailed explanation of the available methods and their parameters:

**1. initializer(config?: { stateFull: boolean })**

* Initializes the ScriptOrchestrator instance.
* Optional `config` object allows setting the `stateFull` property to `false` for stateless mode.
* In stateFull mode all the date is stored in memory.

**2. run(reRun?: boolean)**

* Executes the script loading and execution process based on the configured scripts.
* Optional `reRun` parameter (defaults to `false`) allows re-running previously loaded scripts.

**3. add(config?: { attr?: GenericObject; priority?: LoadPriority; timeout?: number; })**

* Adds a script (either inline or external) to the execution queue.
* Optional `config` object allows for additional configuration.
* For passing attributes, simply pass them directly inside the config object.
* In case you need to use any attributes that are reserved such as priority, timeout, etc. then pass those values inside attr key!

**4. src(srcUrl: string)**

* Used within the `add` method to specify the URL for an external script.

**5. inlineCode(jsCode: string | Function)**

* Used within the `add` method to provide inline JavaScript code
* Can accept js code as string or a function.
* In case function is passed as parameter, it will not be accesible globally.

**6. listen(eventName: string, additionalInfo?: { isCustom: boolean })**

* Attaches an event listener to the script being added.
* `eventName` specifies the event to listen for (e.g., `load`, `error`).
* Optional `additionalInfo` object allows customization:
  * `isCustom`: Set to `true` to attach the listener to a custom event handler within ScriptOrchestrator (defaults to attaching to the window object).

**7. Priority Levels:**

* Scripts can be assigned priority levels to control execution order:
  * **0: Exceptional:** Executes immediately, bypassing the queue.
  * **1: High:** High priority scripts execute before lower priority ones.
  * **2: Medium:** Default priority level.
  * **3: Low:** Lower priority scripts execute after higher priority ones.

**8. Exceptional Priority:**

* Scripts with exceptional priority (value 0) are executed immediately upon adding them, ensuring they run before other scripts regardless of the queue.

### Benefits of Using ScriptOrchestrator

* **Improved Performance:** By prioritizing script loading, you can prevent blocking of critical resources and optimize page load times.
* **Enhanced Code Organization:** Separate script management promotes cleaner and more maintainable code.
* **Reduced Complexity:** ScriptOrchestrator simplifies script handling, especially for complex web applications with numerous dependencies.
* **Increased Flexibility:** Event-driven loading and custom configuration options provide greater control over script behavior.

### Contributing

We welcome contributions from the open-source community! You can find details on contributing to the ScriptOrchestrator project on the project's GitHub repository (link to be added).

### License

ScriptOrchestrator is licensed under the MIT License (see LICENSE file for details).

This README provides a comprehensive overview of ScriptOrchestrator and its functionalities. We encourage you to explore the library and leverage its capabilities to streamline your web development workflow.

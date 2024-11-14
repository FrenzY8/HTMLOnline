let currentTab = "html";
      const codeContent = {
        html:
          localStorage.getItem("HtmlCode") ||
          "<!-- HTML Code Example -->\n<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>",
        css:
          localStorage.getItem("CssCode") ||
          "/* CSS Code Example */\nbody {\n  font-family: Arial, sans-serif;\n  background-color: #f0f0f0;\n  color: #333;\n}",
        js:
          localStorage.getItem("JsCode") ||
          "// JavaScript Code Example\nconsole.log('Hello, World!');\nalert('Hello, World!');",
      };
      const editor = document.getElementById("editor");
      const lineNumbers = document.getElementById("line-numbers");
      function updateLineNumbers() {
        const lines = editor.value.split("\n").length;
        lineNumbers.innerHTML = Array.from(
          { length: lines },
          (_, i) => `<span>${i + 1}</span>`
        ).join("");
      }
      function cleanCode() {
        let parser;
        switch (currentTab) {
          case "html":
            parser = "html";
            break;
          case "css":
            parser = "css";
            break;
          case "js":
            parser = "babel"; 
            break;
          default:
            return;
        }
        try {
          const formattedCode = prettier.format(editor.value, {
            parser: parser,
            plugins: prettierPlugins,
          });
          editor.value = formattedCode;

          codeContent[currentTab] = formattedCode;
          saveToLocalStorage();
          updateLineNumbers();

          alert("Code cleaned / tidied up succesfully.");
        } catch (error) {
          alert("Error while cleaning code: " + error.message);
        }
      }
      function saveToLocalStorage() {
        localStorage.setItem("HtmlCode", codeContent.html);
        localStorage.setItem("CssCode", codeContent.css);
        localStorage.setItem("JsCode", codeContent.js);
      }
      const autoCloseTags = [
        "<html>",
        "<head>",
        "<title>",
        "<body>",
        "<base>",
        "<link>",
        "<meta>",
        "<style>",
        "<script>",
        "<noscript>",
        "<h1>",
        "<h2>",
        "<h3>",
        "<h4>",
        "<h5>",
        "<h6>",
        "<p>",
        "<b>",
        "<i>",
        "<u>",
        "<strong>",
        "<em>",
        "<small>",
        "<mark>",
        "<del>",
        "<ins>",
        "<sub>",
        "<sup>",
        "<blockquote>",
        "<cite>",
        "<q>",
        "<abbr>",
        "<address>",
        "<bdi>",
        "<bdo>",
        "<br>",
        "<wbr>",
        "<ul>",
        "<ol>",
        "<li>",
        "<dl>",
        "<dt>",
        "<dd>",
        "<img>",
        "<figure>",
        "<figcaption>",
        "<audio>",
        "<video>",
        "<source>",
        "<track>",
        "<a>",
        "<form>",
        "<input>",
        "<textarea>",
        "<button>",
        "<select>",
        "<optgroup>",
        "<option>",
        "<label>",
        "<fieldset>",
        "<legend>",
        "<datalist>",
        "<output>",
        "<table>",
        "<caption>",
        "<thead>",
        "<tbody>",
        "<tfoot>",
        "<tr>",
        "<th>",
        "<td>",
        "<col>",
        "<colgroup>",
        "<div>",
        "<span>",
        "<header>",
        "<footer>",
        "<main>",
        "<section>",
        "<article>",
        "<nav>",
        "<aside>",
        "<details>",
        "<summary>",
        "<dialog>",
        "<data>",
        "<time>",
        "<meter>",
        "<progress>",
        "<template>",
        "<svg>",
        "<math>",
        "<canvas>",
        "<embed>",
        "<object>",
        "<param>",
        "<iframe>",
        "<hr>",
        "<code>",
        "<pre>",
        "<kbd>",
        "<samp>",
        "<var>",
      ];
      editor.addEventListener("input", function () {
        const value = editor.value;
        autoCloseTags.forEach((tag) => {
          if (value.endsWith(tag)) {
            const closingTag = tag.replace("<", "</");
            editor.value += closingTag;
          }
        });
        updateLineNumbers();
        codeContent[currentTab] = editor.value;
        saveToLocalStorage();
      });
      editor.addEventListener("keydown", function (event) {
        if (event.key === "Tab") {
          event.preventDefault();
          const start = editor.selectionStart;
          const end = editor.selectionEnd;
          const tab = "  ";
          editor.value =
            editor.value.substring(0, start) +
            tab +
            editor.value.substring(end);
          editor.selectionStart = editor.selectionEnd = start + tab.length;
        }
      });
      function switchTab(tab) {
        document
          .querySelectorAll(".tab")
          .forEach((t) => t.classList.remove("active"));
        document
          .querySelector(`.tab[onclick="switchTab('${tab}')"]`)
          .classList.add("active");
        currentTab = tab;
        editor.value = codeContent[tab];
        updateLineNumbers();
      }
      function runCode() {
        codeContent[currentTab] = editor.value;
        saveToLocalStorage();
        const output = `
        <html>
          <head>
            <style>${codeContent.css}</style>
          </head>
          <body>
            ${codeContent.html}
            <script>
              try {
                ${codeContent.js}
              } catch (error) {
                document.body.innerHTML = "<p style='color: red;'>Error in JavaScript: " + error.message + "</p>";
              }
            <\/script>
          </body>
        </html>
      `;
        const iframe =
          document.getElementById("output-frame").contentWindow.document;
        iframe.open();
        iframe.write(output);
        iframe.close();
        openModal();
      }

      function resetCode() {
        if (confirm("Apakah Anda yakin ingin mereset kode? Semua perubahan akan dihapus dan kode akan dikembalikan ke template awal.")) {
          codeContent.html =
            "<!-- HTML Code Example -->\n<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>";
          codeContent.css =
            "/* CSS Code Example */\nbody {\n  font-family: Arial, sans-serif;\n  background-color: #f0f0f0;\n  color: #333;\n}";
          codeContent.js =
            "// JavaScript Code Example\nconsole.log('Hello, World!');";
          editor.value = codeContent[currentTab];
          updateLineNumbers();
          saveToLocalStorage();
        } else {

        }
      }

      function openModal() {
        document.getElementById("output-modal").style.display = "flex";
      }

      function closeModal() {
        document.getElementById("output-modal").style.display = "none";
      }

      switchTab("html");
updateLineNumbers();

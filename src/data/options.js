require(["lib/chrome-extension/options", "lib/util/cell", "lib/util/ui"], function (options, cell, ui) {
  "use strict";

  function getOpts(f) {
    chrome.storage.local.get(defaults).then((options) => {
      const opts = {};

      for (const s in options) {
        opts[s] = cell.dedupe(options[s], {
          set: function (self, x) {
            if (x === defaults[s]) {
              chrome.storage.local.remove(s);
            } else {
              chrome.storage.local.set({ [s]: x });
            }
          }
        });
      }

      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === "local") {
          Object.keys(changes).forEach((key) => {
            const change = changes[key];
            if ("newValue" in change) {
              opts[key].set(change.newValue);
            } else if ("oldValue" in change) {
              opts[key].set(defaults[key]);
            }
          });
        }
      });

      f(opts);
    });
  }

  getOpts(function (opts) {
    function min0(x) {
      x = +x
      if (x < 0) {
        x = 0
      }
      return x
    }

    options.normalize(function (e) {
      options.category(e, "Basic", function (e) {
        options.checkbox(e, opts["stickyScroll"], {
          default: defaults["stickyScroll"],
          text: "Scroll without holding down the mouse button"
        })

        ui.box(function (e) {
          e.styles(ui.horiz)

          // TODO move to global style
          e.style(function (e) {
            // TODO code duplication with options
            e.set("margin-left", "12px")
          })

          e.addText("...if moving less than ")

          options.textbox(e, opts["dragThreshold"], {
            default: defaults["dragThreshold"],
            type: "number",
            width: "2.5em",
            set: min0
          })

          e.addText(" pixels")
        }).move(e)

        options.separator(e)

        ui.box(function (e) {
          e.styles(ui.horiz)

          e.addText("Scroll if moving more than ")

          options.textbox(e, opts["moveThreshold"], {
            default: defaults["moveThreshold"],
            type: "number",
            width: "2.5em",
            set: min0
          })

          e.addText(" pixels")
        }).move(e)

        options.separator(e)

        ui.box(function (e) {
          e.styles(ui.vert) // TODO ew

          options.checkbox(e, opts["middleClick"], {
            default: defaults["middleClick"],
            text: "Scroll by using (Middle Click)"
          })

          options.checkbox(e, opts["ctrlClick"], {
            default: defaults["ctrlClick"],
            text: "Scroll by using (Ctrl/⌘ + Left Click)"
          })
        }).move(e)
      })

      options.category(e, "Speed", function (e) {
        ui.box(function (e) {
          e.styles(ui.horiz)

          e.addText("Move speed: ")

          options.textbox(e, opts["moveSpeed"], {
            default: defaults["moveSpeed"],
            type: "number",
            width: "2em",
            set: function (x) {
              x = +x
              if (x === 0) {
                x = 1
              }
              return x
            }
          })

          e.addText(" (lower is faster)")
        }).move(e)

        options.separator(e)

        options.checkbox(e, opts["sameSpeed"], {
          default: defaults["sameSpeed"],
          text: "Scroll at the same speed (ignore mouse movement)"
        })

        ui.box(function (e) {
          e.styles(ui.horiz)

          options.checkbox(e, opts["shouldCap"], {
            default: defaults["shouldCap"],
            text: "Don't scroll faster than"
          })

          options.textbox(e, opts["capSpeed"], {
            default: defaults["capSpeed"],
            type: "number",
            width: "2.5em",
            set: function (x) {
              if (x !== "") {
                x = +x
                if (x < 1) {
                  x = 1
                }
              }
              return x
            }
          })

          e.addText(" pixels")
        }).move(e)
      })

      options.category(e, "Advanced", function (e) {
        e.styles(ui.vert) // TODO ew

        options.checkbox(e, opts["innerScroll"], {
          default: defaults["innerScroll"],
          text: "Scroll on inner elements"
        })

        options.checkbox(e, opts["scrollOnLinks"], {
          default: defaults["scrollOnLinks"],
          text: "Scroll when clicking on a link or textarea"
        })
      })
    })
  })
})

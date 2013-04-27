/**
 * 
 * @param container
 * @param options
 * options{
 *      onRemove: callback function to invoke when a item is removed
 *      editable: the item is editable if true
 *      mandatory : a string Array which contains mandatory item
 *      hideAdd : The add button will hide if true
 * 
 * }
 * @param translations
 * @returns
 */


var DynamicLabelList = function(container, options, translations) {
    container = $(container);
    var THIS = this;
    THIS.count = 0;
    var lastLabel;
    var mandatorys;
    if (options == undefined)
        options = {};

    var translate = new Translator(translations);
    var Label = function(text, isMandatory) {
        var HTML = $("<div>").addClass("color-light-gray");

        if (!isMandatory) {
            HTML.append($("<a>").css('color', '#D02E26').css("margin-right", "5px").addClass("icon-remove").attr("href", "#").click(function() {
                if(THIS.count == 1){
                    HTML.remove();
                    lastLabel = null;
                }
                else if (lastLabel == HTML) {
                    HTML.remove();
                    lastLabel = container.find("div.color-light-gray:last");
                } else {
                    HTML.remove();
                }
                $.removeData(THIS, text);
                THIS.count--;
                if(options["onRemove"]){
                    options["onRemove"](text);
                }
            }));
        }
        
        var inputBox = $('<input name="item" class="required" />');
        var span = $("<span>");
        inputBox.keydown(function(eventData) {
            if (eventData.keyCode == '13') {
                HTML.find("span").text(inputBox.val()).show();
                inputBox.hide();
                eventData.preventDefault();
            }

        });
        
        if(!isMandatory && options["editable"]) {
            span.dblclick(function() {
                $(this).hide();
                inputBox.show();
            });
            span.popover({
                "content" : "Double click to edit",
                "trigger" : "hover",
                "delay" : 200
            });
        }
        
        if (text == undefined) {
            span.hide();
            
        } else {
            span.text(text);
            inputBox.hide();
        }
        HTML.append(inputBox);
        HTML.append(span);

        return function() {
            return HTML;
        }
    }
    var add = function(text, isMandatory) {
        if ($.data(THIS, text) == text) {
            return false;
        }
        var label = new Label(text, isMandatory);
        if (!lastLabel) {
            lastLabel = label();
            container.prepend(lastLabel);

        } else {
            var newLabel = label();
            lastLabel.after(newLabel);
            lastLabel = newLabel;
        }
        THIS.count++;
        $.data(THIS, text, text);
        return true;
    }

    if (options["onEditComplete"]) {
        //TODO
    }

    if (options['mandatory']) {
        var mandatory = options['mandatory'];

        if ( mandatory instanceof Array) {
            for (var i = 0, j = mandatory.length; i < j; i++) {
                add(mandatory[i], true);
            }

        } else if ( typeof (mandatory) == "string") {
            add(mandatory, true);
        }

    }
    if (!options['hideAdd']) {
        var addLink = $("<a>");
        container.append(addLink);
        addLink.text(translate("+ Add"));
        addLink.attr("href", "#");
        addLink.click(function() {
            add();
            return false;
        });
    }
    DynamicLabelList.prototype.add = add;
    DynamicLabelList.prototype.clean = function() {
        $(container.empty());
        THIS.count = 0;
        $.removeData(THIS);
        lastLabel = null;
    };
}

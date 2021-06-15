// Extensions implemented:
// http://hl7.org/fhir/StructureDefinition/entryFormat
// http://hl7.org/fhir/StructureDefinition/rendering-markdown
// http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl
//    drop-down, check-box, autocomplete

// Vue.component('p-calendar', calendar);

Vue.component('fhirq-choice', {
    props: ['item_defn', 'path']
});
Vue.component('fhirq-item', {
    // The todo-item component now accepts a
    // "prop", which is like a custom attribute.
    // This prop is called todo.
    props: ['item_defn', 'path', 'context'],

    template: `
        <div class="row mb-3">
            <!-- <i>{{ path }} ({{item_defn.type}})</i> -->
            <div v-if="item_defn.type === 'group'">
                <h3>{{ item_defn.text }}</h3>
            </div>
            <div v-else-if="item_defn.type === 'display'">
                <template v-if="!hasMarkdown">{{item_defn.text}}</template>
                <div v-if="hasMarkdown" v-html="textAsHtml"></div>
            </div>
            <div v-else-if="item_defn.type === 'boolean'">
                <input class="form-check-input" type="checkbox" v-model="value" value="" v-bind:id="path">
                <label class="form-check-label" v-bind:for="path">
                {{ item_defn.text }}
                </label>
            </div>
            <div v-else-if="item_defn.type === 'decimal'" >
                <label for="exampleFormControlInput1" class="form-label">{{ item_defn.text }}</label>
                <input class="form-control" type="number" style="width:150px;" v-model="value" v-bind:id="item_defn.linkId">
            </div>
            <div v-else-if="item_defn.type === 'integer'" >
                <label for="exampleFormControlInput1" class="form-label">{{ item_defn.text }}</label>
                <input class="form-control" type="number" style="width:150px;" v-model="value" v-bind:id="item_defn.linkId">
            </div>
            <template v-else-if="item_defn.type === 'date'" >
                <label for="exampleFormControlInput1" class="col-sm-4 col-form-label">{{ item_defn.text }}</label>
                <div class="col-sm-4 input-group" >
                    <input class="form-control" type="date" style="max-width:170px;" v-bind:id="item_defn.linkId" v-model="value" v-bind:placeholder="placeholderText">
                </div>
                <!-- <p-calendar style="max-width:180px;" v-bind:id2="item_defn.linkId" :utc="false" v-model="value" v-bind:placeholder="placeholderText"  dateFormat="dd/mm/yy" :showIcon="true"  :showButtonBar="true"></p-calendar> -->
            </template>
            <template v-else-if="item_defn.type === 'dateTime'" >
                <label for="exampleFormControlInput1" class="col-sm-4 col-form-label">{{ item_defn.text }}</label>
                <div class="col-sm-4 input-group" >
                    <input class="form-control" type="datetime-local" style="max-width:200px;" v-bind:id="item_defn.linkId" v-model="value" v-bind:placeholder="placeholderText">
                </div>
            </template>
            <template v-else-if="item_defn.type === 'time'" >
                <label for="exampleFormControlInput1" class="col-sm-4 col-form-label">{{ item_defn.text }}</label>
                <div class="col-sm-4 input-group" >
                    <input class="form-control" type="time" style="max-width:140px;" v-bind:id="item_defn.linkId" v-model="value" v-bind:placeholder="placeholderText">
                </div>
            </template>
            <div v-else-if="item_defn.type === 'string'" >
                <label for="exampleFormControlInput1" class="form-label">{{ item_defn.text }}</label>
                <input class="form-control" v-bind:id="item_defn.linkId" v-model.sync="value" v-bind:placeholder="placeholderText">
            </div>
            <div v-else-if="item_defn.type === 'text'" >
                <label for="exampleFormControlInput1" class="form-label">{{ item_defn.text }}</label>
                <textarea class="form-control" :autoResize="true" v-bind:id="item_defn.linkId" v-model="value" v-bind:placeholder="placeholderText"></textarea>
            </div>
            <div v-else-if="item_defn.type === 'url'" >
                <label for="exampleFormControlInput1" class="form-label">{{ item_defn.text }}</label>
                <input class="form-control" type="url" v-bind:id="item_defn.linkId" v-model.sync="value" v-bind:placeholder="placeholderText">
            </div>
            <template v-else-if="item_defn.type === 'choice'">
                <template v-if="itemControl() === 'check-box'">
                    <label class="form-check-label col-sm-4 col-form-label" v-bind:for="item_defn.linkId">
                    {{ item_defn.text }}
                    </label>
                    <input class="form-check-input col-sm-8" type="checkbox" v-model.sync="value" value="" v-bind:id="item_defn.linkId">
                </template>
                <template v-else-if="itemControl() === 'drop-down'">
                    <label class="form-check-label col-sm-4 col-form-label" v-bind:for="item_defn.linkId">
                        {{item_defn.text}}
                    </label>
                    <select v-if="!item_defn.repeats" class="form-select col-sm-8" v-model.sync="value" aria-label="Default select example" v-bind:id="item_defn.linkId">
                        <option ></option>
                        <option v-for="option in answerOptions" v-bind:value="option.system + '#' + option.code">{{ option.display }}</option>
                    </select>
                    <div v-else class="col-sm-8">
                        <div v-for="(option,index) in answerOptions">
                            <input class="form-check-input" type="checkbox" v-bind:value="option.system + '#' + option.code" v-model.sync="value" v-bind:id="item_defn.linkId+'_'+index">
                            <label class="form-check-label" v-bind:for="item_defn.linkId+'_'+index">
                            {{ option.display }}{{ option.valueString }}
                            </label>
                        </div>
                    </div>
                </template>
                <template v-else-if="itemControl() === 'autocomplete'">
                    <label v-bind:for="item_defn.linkId" class="col-sm-4 col-form-label">{{ item_defn.text }}</label>
                    <div class="col-sm-8">
                        <input class="form-control" v-bind:id="item_defn.linkId" v-bind:placeholder="placeholderText">
                    </div>
                </template>
                <template v-else>
                    <label v-bind:for="item_defn.linkId" class="col-sm-4 col-form-label">{{ item_defn.text }}</label>
                    <div class=" col-sm-8">
                    <div class="form-check" v-for="(option, index) in answerOptions">
                        <input class="form-check-input" type="radio" v-bind:name="item_defn.linkId" v-model.sync="value" v-bind:value="option.system + '#' + option.code" v-bind:id="item_defn.linkId+'_'+index">
                        <label class="form-check-label" v-bind:for="item_defn.linkId+'_'+index">
                        {{option.display}}
                        </label>
                        </div>
                    </div>
                </template>
            </template>
            <div v-else-if="item_defn.type === 'open-choice'" >
                <label for="exampleFormControlInput1" class="form-label">{{ item_defn.text }}</label>
                <input class="form-control" v-bind:id="item_defn.linkId" v-model.sync="value" v-bind:placeholder="placeholderText">
            </div>
            <div v-else-if="item_defn.type === 'attachment'" >
                <label for="exampleFormControlInput1" class="form-label">{{ item_defn.text }}</label>
                <input class="form-control" type="file" v-on:change="selectAttachment" v-bind:id="item_defn.linkId">
            </div>
            <div v-else-if="item_defn.type === 'reference'" >
                <label for="exampleFormControlInput1" class="form-label">{{ item_defn.text }}</label>
                <input class="form-control" type="url" v-model="value" v-bind:id="item_defn.linkId">
            </div>
            <div v-else-if="item_defn.type === 'quantity'" >
                <label for="exampleFormControlInput1" class="form-label">{{ item_defn.text }}</label>
                <input class="form-control" style="width:150px;" v-model="value" v-bind:id="item_defn.linkId">
            </div>
            <template v-else>
                <font color=red>UNKNOWN: {{ item_defn.type }}</font> {{ item_defn.text }}
            </template>
            <ul v-if="item_defn && item_defn.item && item_defn.item.length > 0">
                <fhirq-item v-for="(child, index) in item_defn.item"    
                            v-bind:item_defn="child" 
                            v-bind:path="path + '.item[' + index + ']'" 
                            v-bind:context.sync="context.item_model[index]"
                            v-bind:key="child.linkId"></fhirq-item>
            </ul>
        </div>
    `,
    computed: {
        placeholderText: function () {
            var placeholderExtension = getFirstExtensionByUrl(this.item_defn, "http://hl7.org/fhir/StructureDefinition/entryFormat");
            if (placeholderExtension && placeholderExtension.valueString)
                return placeholderExtension.valueString;
            return undefined;
        },
        textAsHtml: function () {
            return getMarkdownHtml(this.item_defn._text);
        },
        answerOptions: function () {
            result = [];
            if (this.item_defn.answerOption && this.item_defn.answerOption.length > 0) {
                this.item_defn.answerOption.forEach(element => {
                    if (element.valueCoding)
                        result.push(element.valueCoding);
                });
            }
            return result;
        },
        value: {
            get: function () {
                if (!this.context.qr_item.answer || this.context.qr_item.answer.length === 0)
                    return '';
                if (this.item_defn.type === "boolean") {
                    if (this.context.qr_item.answer[0].valueBoolean)
                        return this.context.qr_item.answer[0].valueBoolean;
                    return false;
                }
                if (this.item_defn.type === "decimal") {
                    if (this.context.qr_item.answer[0].valueDecimal)
                        return this.context.qr_item.answer[0].valueDecimal;
                    return '';
                }
                if (this.item_defn.type === "integer") {
                    if (this.context.qr_item.answer[0].valueInteger)
                        return this.context.qr_item.answer[0].valueInteger;
                    return '';
                }
                if (this.item_defn.type === "date") {
                    // need to convert the date value here according to browser locale formatting
                    if (this.context.qr_item.answer[0].valueDate)
                        return this.context.qr_item.answer[0].valueDate;
                    return '';
                }
                if (this.item_defn.type === "dateTime") {
                    // need to convert the date value here according to browser locale formatting/timezone
                    if (this.context.qr_item.answer[0].valueDateTime)
                        return this.context.qr_item.answer[0].valueDateTime;
                    return '';
                }
                if (this.item_defn.type === "time") {
                    // need to convert the date value here according to browser locale formatting
                    if (this.context.qr_item.answer[0].valueTime)
                        return this.context.qr_item.answer[0].valueTime;
                    return '';
                }
                if (this.item_defn.type === "string") {
                    if (this.context.qr_item.answer[0].valueString)
                        return this.context.qr_item.answer[0].valueString;
                    return '';
                }
                if (this.item_defn.type === "text") {
                    // replace the linefeed chars
                    if (this.context.qr_item.answer[0].valueString)
                        return this.context.qr_item.answer[0].valueString;
                    return '';
                }
                if (this.item_defn.type === "url") {
                    if (this.context.qr_item.answer[0].valueUri)
                        return this.context.qr_item.answer[0].valueUri;
                    return '';
                }
                if (this.item_defn.type === "choice") {
                    if (this.context.qr_item.answer[0].valueCoding)
                        return this.context.qr_item.answer[0].valueCoding.system + '#' + this.context.qr_item.answer[0].valueCoding.code;
                    return '';
                }
                if (this.item_defn.type === "open-choice") {
                    if (this.context.qr_item.answer[0].valueCoding)
                        return this.context.qr_item.answer[0].valueCoding.system + '#' + this.context.qr_item.answer[0].valueCoding.code;
                    if (this.context.qr_item.answer[0].valueString)
                        return this.context.qr_item.answer[0].valueString;
                    return '';
                }
                if (this.item_defn.type === "attachment") {
                    if (this.context.qr_item.answer[0].valueAttachment)
                        return this.context.qr_item.answer[0].valueAttachment;
                    return '';
                }
                if (this.item_defn.type === "reference") {
                    if (this.context.qr_item.answer[0].valueReference)
                        return this.context.qr_item.answer[0].valueReference;
                    return '';
                }
                if (this.item_defn.type === "quantity") {
                    if (this.context.qr_item.answer[0].valueQuantity)
                        return this.context.qr_item.answer[0].valueQuantity.value;
                    return '';
                }
                return '';
            },
            set: function (val) {
                if (this.item_defn.type === "boolean") {
                    if (!this.context.qr_item.answer)
                        this.context.qr_item.answer = [];
                    if (this.context.qr_item.answer.length < 1)
                        this.context.qr_item.answer.push({ "valueBoolean": val })
                    else
                        this.context.qr_item.answer[0] = { "valueBoolean": val };
                    if (val.length == 0)
                        delete this.context.qr_item.answer;
                }
                if (this.item_defn.type === "decimal") {
                    if (!this.context.qr_item.answer)
                        this.context.qr_item.answer = [];
                    if (this.context.qr_item.answer.length < 1)
                        this.context.qr_item.answer.push({ "valueDecimal": val })
                    else
                        this.context.qr_item.answer[0] = { "valueDecimal": val };
                    if (val.length == 0)
                        delete this.context.qr_item.answer;
                }
                if (this.item_defn.type === "integer") {
                    if (!this.context.qr_item.answer)
                        this.context.qr_item.answer = [];
                    if (this.context.qr_item.answer.length < 1)
                        this.context.qr_item.answer.push({ "valueInteger": val })
                    else
                        this.context.qr_item.answer[0] = { "valueInteger": val };
                    if (val.length == 0)
                        delete this.context.qr_item.answer;
                }
                if (this.item_defn.type === "date") {
                    if (!this.context.qr_item.answer)
                        this.context.qr_item.answer = [];
                    if (this.context.qr_item.answer.length < 1)
                        this.context.qr_item.answer.push({ "valueDate": val })
                    else
                        this.context.qr_item.answer[0] = { "valueDate": val };
                    if (val.length == 0)
                        delete this.context.qr_item.answer;
                }
                if (this.item_defn.type === "dateTime") {
                    if (!this.context.qr_item.answer)
                        this.context.qr_item.answer = [];
                    if (this.context.qr_item.answer.length < 1)
                        this.context.qr_item.answer.push({ "valueDateTime": val })
                    else
                        this.context.qr_item.answer[0] = { "valueDateTime": val };
                    if (val.length == 0)
                        delete this.context.qr_item.answer;
                }
                if (this.item_defn.type === "time") {
                    if (!this.context.qr_item.answer)
                        this.context.qr_item.answer = [];
                    if (this.context.qr_item.answer.length < 1)
                        this.context.qr_item.answer.push({ "valueTime": val })
                    else
                        this.context.qr_item.answer[0] = { "valueTime": val };
                    if (val.length == 0)
                        delete this.context.qr_item.answer;
                }
                if (this.item_defn.type === "string") {
                    if (!this.context.qr_item.answer)
                        this.context.qr_item.answer = [];
                    if (this.context.qr_item.answer.length < 1)
                        this.context.qr_item.answer.push({ "valueString": val })
                    else
                        this.context.qr_item.answer[0] = { "valueString": val };
                    if (val.length == 0)
                        delete this.context.qr_item.answer;
                }
                if (this.item_defn.type === "text") {
                    if (!this.context.qr_item.answer)
                        this.context.qr_item.answer = [];
                    // replace the linefeed chars
                    if (this.context.qr_item.answer.length < 1)
                        this.context.qr_item.answer.push({ "valueString": val })
                    else
                        this.context.qr_item.answer[0] = { "valueString": val };
                    if (val.length == 0)
                        delete this.context.qr_item.answer;
                }
                if (this.item_defn.type === "url") {
                    if (!this.context.qr_item.answer)
                        this.context.qr_item.answer = [];
                    if (this.context.qr_item.answer.length < 1)
                        this.context.qr_item.answer.push({ "valueUri": val })
                    else
                        this.context.qr_item.answer[0] = { "valueUri": val };
                    if (val.length == 0)
                        delete this.context.qr_item.answer;
                }
                if (this.item_defn.type === "choice") {
                    if (!this.context.qr_item.answer)
                        this.context.qr_item.answer = [];
                    var system = val;
                    var code = val;
                    if (val.indexOf("#") > -1) {
                        system = val.substring(0, val.indexOf("#"));
                        code = val.substring(val.indexOf("#") + 1);
                    }
                    if (this.context.qr_item.answer.length < 1)
                        this.context.qr_item.answer.push({ "valueCoding": { "system": system, "code": code } })
                    else
                        this.context.qr_item.answer[0] = { "valueCoding": { "system": system, "code": code } };
                    if (val.length == 0)
                        delete this.context.qr_item.answer;
                }
                if (this.item_defn.type === "open-choice") {
                    if (!this.context.qr_item.answer)
                        this.context.qr_item.answer = [];
                    if (this.context.qr_item.answer.length < 1)
                        this.context.qr_item.answer.push({ "valueCoding": { "code": val } })
                    else
                        this.context.qr_item.answer[0] = { "valueCoding": { "code": val } };
                    if (val.length == 0)
                        delete this.context.qr_item.answer;
                }
                if (this.item_defn.type === "attachment") {
                    if (!this.context.qr_item.answer)
                        this.context.qr_item.answer = [];
                    if (this.context.qr_item.answer.length < 1)
                        this.context.qr_item.answer.push({ "valueAttachment": val })
                    else
                        this.context.qr_item.answer[0] = { "valueAttachment": val };
                    if (val.length == 0)
                        delete this.context.qr_item.answer;
                }
                if (this.item_defn.type === "reference") {
                    if (!this.context.qr_item.answer)
                        this.context.qr_item.answer = [];
                    if (this.context.qr_item.answer.length < 1)
                        this.context.qr_item.answer.push({ "valueReference": val })
                    else
                        this.context.qr_item.answer[0] = { "valueReference": val };
                    if (val.length == 0)
                        delete this.context.qr_item.answer;
                }
                if (this.item_defn.type === "quantity") {
                    if (!this.context.qr_item.answer)
                        this.context.qr_item.answer = [];
                    if (this.context.qr_item.answer.length < 1)
                        this.context.qr_item.answer.push({ "valueQuantity": val })
                    else
                        this.context.qr_item.answer[0] = { "valueQuantity": val };
                    if (val.length == 0)
                        delete this.context.qr_item.answer;
                }
            }
        }
    },
    methods: {
        hasMarkdown: function () {
            var markdownExtension = getFirstExtensionByUrl(text_element, "http://hl7.org/fhir/StructureDefinition/rendering-markdown");
            return (markdownExtension && markdownExtension.valueMarkdown);
        },
        itemControl: function () {
            return itemControl(this.item_defn);
        },
        selectAttachment: function (att) {
            if (att.target && att.target.files && att.target.files.length == 1) {
                var file = att.target.files[0];
                const reader = new FileReader();
                var $valAttachment = {
                    "size": file.size,
                    "title": file.name,
                    "creation": file.lastModifiedDate
                };
                if (file.type && file.type.length > 0) {
                    $valAttachment.contentType = file.type;
                }
                if (!this.context.qr_item.answer)
                    this.context.qr_item.answer = [];
                if (this.context.qr_item.answer.length < 1)
                    this.context.qr_item.answer.push({ "valueAttachment": $valAttachment })
                else
                    this.context.qr_item.answer[0] = { "valueQuantity": $valAttachment };
                reader.onload = function (fileLoadedEvent) {
                    // Also need to trim out the prefix content from the reader
                    // "data": "data:application/octet-stream;base64,WzEwMTY...
                    var prefixContent = fileLoadedEvent.target.result.substring(0, fileLoadedEvent.target.result.indexOf(";base64,"));
                    $valAttachment.contentType = prefixContent.substring(5);
                    $valAttachment.data = fileLoadedEvent.target.result.substring(fileLoadedEvent.target.result.indexOf(";base64,")+8);
                };
                reader.readAsDataURL(file);
            } else {
                delete this.context.qr_item.answer;
            }
        }
    }
});

function getMarkdownHtml(text_element) {
    var markdownExtension = getFirstExtensionByUrl(text_element, "http://hl7.org/fhir/StructureDefinition/rendering-markdown");
    if (markdownExtension && markdownExtension.valueMarkdown) {
        // Decode the markdown into HTML
        var converter = new showdown.Converter();
        return converter.makeHtml(markdownExtension.valueMarkdown);
    }
    return '';
}

function itemControl(item_defn) {
    var extension = getFirstExtensionByUrl(item_defn, "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl");
    if (extension && extension.valueCodeableConcept && extension.valueCodeableConcept.coding && extension.valueCodeableConcept.coding.length > 0) {
        var coding = extension.valueCodeableConcept.coding[0];
        if (coding.system === "http://hl7.org/fhir/questionnaire-item-control") {
            // HL7 defined control types
            return coding.code;
        }
    }
    return undefined;
}

function getFirstExtensionByUrl(extendable, url) {
    var result = getExtensionsByUrl(extendable, url);
    if (result && result.length > 0)
        return result[0];
    return undefined;
}

function getExtensionsByUrl(extendable, url) {
    var result = [];
    if (extendable && extendable.extension && extendable.extension.length > 0) {
        extendable.extension.forEach(element => {
            if (element.url === url) {
                result.push(element);
            }
        });
    }
    return result;
}

function generateModelItems(item_model, qis, qris) {
    if (qis.length > 0) {
        for (var n = 0; n < qis.length; n++) {
            var itemQ = qis[n];
            var matched = false;
            if (qris.length > 0) {
                for (var nqr = 0; nqr < qris.length; nqr++) {
                    var itemQR = qris[nqr];
                    if (itemQR.linkId === itemQ.linkId) {
                        matched = true;
                        var t = {
                            q_item: itemQ,
                            qr_item: itemQR,
                            issues: [],
                            item_model: []
                        };
                        item_model.push(t);
                        if (itemQ.item && itemQ.item.length > 0) {
                            if (!itemQR.item)
                                itemQR.item = [];
                            generateModelItems(t.item_model, itemQ.item, itemQR.item);
                        }
                    }
                }
            }
            if (!matched) {
                // We need to add a new one anyway to the QR
                var itemQR = { linkId: itemQ.linkId, text: itemQ.text };
                qris.push(itemQR);
                var t = {
                    q_item: itemQ,
                    qr_item: itemQR,
                    issues: [],
                    item_model: []
                };
                item_model.push(t);
                if (itemQ.item && itemQ.item.length > 0) {
                    if (!itemQR.item)
                        itemQR.item = [];
                    generateModelItems(t.item_model, itemQ.item, itemQR.item);
                }
            }
        }
    }
}

function generateModel(q, qr) {
    var result = {
        questionnaire: q,
        questionnaireresponse: qr,
        item_model: []
    };
    if (!q.item)
        q.item = [];
    if (!qr.item)
        qr.item = [];
    generateModelItems(result.item_model, q.item, qr.item);
    return result;
}

function displayErrorAndWarningMessages(model, outcome) {
    // drill through the model to find the instance, and attach the error message

}

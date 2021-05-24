## Introduction ##
This is an implementation of the [FHIR(R4)][r4-spec] [SDC][sdc-spec] renderer primarily intended to support rendering in FHIR Implementation Guides.
It has no server side components, all rendering is done in the browser.

New Features in v0.0.1: (the first version)
* Limitted support for basic rendering of a FHIR Questionnaire Resource (R4)
* Extraction of QuestionnaireResponse from the user entered data

Key features:
* Evaluation [FhirPath][fhirpath-spec] expressions (extract/validate)

Technically the component is:
* Uses the [VueJS framework](https://vuejs.org/)
* Uses the bootstrap rendering library
* Uses the JQuery framework for some operations
* Uses the [fhirpath.js] project for fhirpath evaluations
  * (Files copied into this project for convenience only)


## Support 
Issues can be raised in the GitHub repository at [https://github.com/brianpos/fhir-q-render/issues](https://github.com/brianpos/fhir-q-render/issues).
You are welcome to register your bugs and feature suggestions there. 
For questions and broader discussions, use the Questionnaire FHIR Implementers chat on [Zulip][questionnaire-zulip].

## Contributing ##
I would gladly welcome any contributors!

If you want to participate in this project, I'm using [Git Flow][nvie] for branch management, so please submit your commits using pull requests no on the develop branches mentioned above! 

### GIT branching strategy
- [NVIE](http://nvie.com/posts/a-successful-git-branching-model/)
- Or see: [Git workflow](https://www.atlassian.com/git/workflows#!workflow-gitflow)

## Licensing
HL7(R),  FHIR(R) and the FHIR Mark(R) are trademarks owned by Health Level Seven International, 
registered with the United States Patent and Trademark Office.

[fhirpath-spec]: http://hl7.org/fhirpath/
[sdc-spec]: http://build.fhir.org/ig/HL7/sdc/
[r4-spec]: http://www.hl7.org/fhir/R4/
[fhirpath.js]: https://github.com/HL7/fhirpath.js
[questionnaire-zulip]: https://chat.fhir.org/#narrow/stream/179255-questionnaire
[nvie]: http://nvie.com/posts/a-successful-git-branching-model/

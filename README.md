# angular-checkboxes
Bind a list of checkboxes to a unique ng-model

[![npm version](https://badge.fury.io/js/angular-checkboxes.svg)](http://badge.fury.io/js/angular-checkboxes)
[![Build Status](http://img.shields.io/travis/msieurtoph/angular-checkboxes.svg)](https://travis-ci.org/msieurtoph/angular-checkboxes) [![Code Climate](https://codeclimate.com/github/msieurtoph/angular-checkboxes/badges/gpa.svg)](https://codeclimate.com/github/msieurtoph/angular-checkboxes) [![Test Coverage](https://codeclimate.com/github/msieurtoph/angular-checkboxes/badges/coverage.svg)](https://codeclimate.com/github/msieurtoph/angular-checkboxes)

[![dependency Status](http://img.shields.io/david/msieurtoph/angular-checkboxes.svg?style=flat)](https://david-dm.org/msieurtoph/angular-checkboxes#info=dependencies) [![devDependency Status](http://img.shields.io/david/dev/msieurtoph/angular-checkboxes.svg?style=flat)](https://david-dm.org/msieurtoph/angular-checkboxes#info=devDependencies)

## Démo

http://msieurtoph.github.io/angular-checkboxes

## What is it?

If you are used to manipulate HTML forms, you probably know that each checkbox is a separate variable (or maybe an ngModel with AngularJS).

Sometimes, it could be usefull to manipulate all these checkboxes as a unique array.

`angular.checkboxes` module lets you turn your list of checkboxes into a unique parent ngModel, providing :
* **two-way binding**: manipulate parent ngModel will check/uncheck the checkboxes AND check/uncheck the checkboxes will modify the parent ngModel.
* **possibility to add post-processing tasks on the parent ngModel**: like those coming with the native angular ngModelController (validators, parsers, formatters, etc ...).
* **no isolated scope for each checkbox**: the directive does not create new child scope.
* **a mtCheckboxController**: internal controller can be injected to other directives and give them the control on this one.

## Simple Example

Please, visit http://msieurtoph.github.io/angular-checkboxes for live examples.

```html
<form>
    ...
    <div ng-model="myUniqueModel">
        <input type="checkbox" mt-checkbox name="value1" /> Value 1 <br/>
        <input type="checkbox" mt-checkbox name="value2" /> Value 2 <br/>
        <input type="checkbox" mt-checkbox name="value3" /> Value 3 <br/>
    </div>
    ...
</form>

```

Let's check *Value 1* and *Value 2*, and you will get (in the current scope):

```javascript
myUniqueModel= [
    "value1",
    "value2"
];
```

Let's push `value3` to myUniqueModel now, and you will check the *Value 3* checkbox.

Pretty cool, no ?

**/!\ Do not forget to $apply() the scope changes when manipulating parent ngModel!**

## What if the checkbox also has an ngModel

Don't care about that, the module takes it in charge. Just use it/them if you need, they will be updated with the flow: if you add or remove a value from the parent ngModel, the checkbox ngModel (a boolean) will be switched.

## mtCheckboxController

The directive provides a `controller`. It publishes :

* `value` (string)

  The value that will be pushed to/shifted from the parent ngModel for this checkbox. See [Allowed Syntaxes](#allowed-syntaxes) to know how to initialize it.

* `isChecked` (boolean)

  It tells if the checkbox is currently checked or not

* `check(value)` (function(boolean))

  It allows external directives to check (`value=true`) or uncheck (`value=false`) the checkbox programmatically. Any other non-boolean `value` will throw an error.

## Allowed syntaxes

All these syntaxes can be used :

```html
    <div ngModel="parentModel">

        <input type="checkbox" mt-checkbox />
        <!-- value = 'Checkbox_*'; * is an auto-incremented integer !-->

        <input type="checkbox" mt-checkbox name="nameValue" />
        <!-- value = 'nameValue' !-->

        <input type="checkbox" mt-checkbox="dirValue" />
        <!-- value = 'dirValue' !-->

        <input type="checkbox" mt-checkbox="dirValue" name="nameValue" />
        <!-- value = 'dirValue'; mt-checkbox value overrides name attribute !-->

        <input type="checkbox" mt-checkbox name="nameValue" ng-model="checkboxModel" />
        <!-- in addition, directive supports native checkbox ngModel -->

    </div>
```
'use strict';

angular.module('msieurtoph.ngCheckboxes', [])

.directive('mtTo', ['$timeout', function($timeout){
    return {
        restrict: 'A',
        require: '?ngModel',
        controller: ['$parse', '$attrs', '$scope', '$element', function($parse, $attrs, $scope, $element){
            var ngModelCtrl = $element.controller('ngModel');
            var getter;
            if ($attrs.ngModel) {
              getter = $parse($attrs.ngModel);
            } else {
              getter = $parse($attrs.mtTo);
            }
            var defaultValue;
            if ($attrs.mtDefault) {
              // mt-defaultに値があるとデフォルト値として扱う
              var tmpValue = $parse($attrs.mtDefault)($scope);
              if (Array.isArray(tmpValue)) {
                defaultValue = tmpValue;
              } else if (Object(tmpValue) === tmpValue) {
                // objectの場合はキーの配列
                defaultValue = Object.keys(tmpValue);
              }
            }
            var setter = getter.assign,
                _this = this
            ;

            this.get = function(isRef){
                var value = getter($scope);
                if (defaultValue && !value) {
                  return isRef ? defaultValue : angular.copy(defaultValue);
                }
                return value || [];
            };

            this.set = function(list){
                var snapshot = angular.copy(list);
                if (defaultValue && defaultValue.length === snapshot.length) {
                  var isDefault = true;
                  for (var i=0; i<defaultValue.length; ++i) {
                    var it = defaultValue[i];
                    if (isDefault && -1 === snapshot.indexOf(it)) {
                      isDefault = false;
                    }
                  }
                  if (isDefault) {
                    snapshot = null;
                  }
                }
                setter($scope, snapshot);
                if ($attrs.ngModel) {
                  ngModelCtrl.$setViewValue(snapshot);
                }
            };

            this.indexOf = function(elt){
                var list = _this.get(true);
                for (var i=0, l=list.length; i<l; i++){
                    if (angular.equals(list[i], elt)) {
                        return i;
                    }
                }
                return -1;
            };

            this.add = function(elt){
                $timeout(function(){
                    if (-1 === _this.indexOf(elt)){
                        var list = _this.get();
                        list.push(elt);
                        _this.set(list);
                    }
                });
            };

            this.remove = function(elt){
                $timeout(function(){
                    var index = _this.indexOf(elt);
                    if (-1 !== index){
                        var list = _this.get();
                        list.splice(index, 1);
                        _this.set(list);
                    }
                });
            };

        }]
    };
}])

.directive('mtCheckbox', [function () {

    var internalCount = 0;
    function uniqName(){
        return 'mtCheckBox_' + (++internalCount);
    }

    return {
        restrict: 'A',
        require: ['mtCheckbox', '^mtTo', '?ngModel'],
        scope: {
          name: '@'
        },
        controller: ['$attrs', '$parse', '$scope', function($attrs, $parse, $scope){

            var getter = $parse($attrs.mtCheckbox),
                setter = getter.assign
            ;

            if ('' === $attrs.mtCheckbox) {

                this.value = !!$attrs.name && '' !== $attrs.name ? $scope.name : uniqName();

            } else if (!angular.isFunction(setter)) {

                this.value = getter($scope);

            } else {

                Object.defineProperty(this, 'value', {
                    enumerable: true,
                    get: function(){
                        return getter($scope);
                    },
                    set: function(val){
                        setter($scope, val);
                    }
                });

            }


            // state is undefined until the first control;
            this.state = undefined;

        }],

        link: {
            pre: function(scope, element, attrs, ctrls){

                var ctrl = ctrls[0],
                    destCtrl = ctrls[1],
                    ngModelCtrl = ctrls[2]
                ;

                ctrl.hasNgModel = !! ngModelCtrl;



                // watch changes on the element
                // and then call set() ...
                if (ctrl.hasNgModel) {

                    scope.$watch(attrs.ngModel, function(newVal, oldVal){
                        if (newVal !== oldVal){
                            ctrl.set(newVal);
                        }
                    });

                } else {

                    element.on('change', function(){
                        ctrl.set(!ctrl.state);
                    });

                }



                // watch changes in the dest Model (= the array)
                // and then call set() ...
                scope.$watchCollection(function (){
                    return -1 !== destCtrl.indexOf(ctrl.value);
                }, function(newV){
                    ctrl.set(newV);
                });



                // add method to the controller to check/uncheck the checkbox!
                // init state, set local state/model and report to parent Model
                ctrl.set = function(state){

                    // if ngModel does not have same state
                    // then change ngModel and abort, because the $viewValueListener will run again the set()
                    if (ctrl.hasNgModel && state !== ngModelCtrl.$modelValue) {
                        ngModelCtrl.$setViewValue(state);
                        return;
                    }

                    // abort if the ckeck/uncheck is already performed
                    if (ctrl.state === state || 'boolean' !== typeof state){
                        return;
                    }

                    // perform the check/uncheck
                    ctrl.state = !!state;
                    element[0].checked = ctrl.state;

                    destCtrl[ctrl.state ? 'add' : 'remove'](ctrl.value);

                };
            }

        }

    };
}]);

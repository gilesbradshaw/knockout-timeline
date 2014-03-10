(function() {
  define(["jquery", "knockout", "VMM.Date", "VMM.Util", "VMM.ExternalAPI"], function($, ko, vDate, util, externalAPI) {
    var computed, parseDate;

    ko.virtualElements.allowedBindings.importDates = true;
    ko.virtualElements.allowedBindings.dates = true;
    computed = function(k) {
      return ko.computed({
        deferEvaluation: true,
        read: k
      });
    };
    parseDate = function(date) {
      var result;

      return result = {
        _date: date,
        startDate: computed(function() {
          return vDate.parse(ko.unwrap(date.startDate), true).date;
        }),
        precisionDate: computed(function() {
          return vDate.parse(ko.unwrap(date.startDate), true).precision;
        }),
        endDate: computed(function() {
          var e;

          e = ko.unwrap(date.endDate);
          if (e && !isNaN(vDate.parse(e))) {
            return vDate.parse(e);
          } else {
            return result.startDate();
          }
        }),
        needs_slug: computed(function() {
          return (date.slug != null) && date.slug() !== "" && (!date.headline || !date.headline());
        }),
        title: computed(function() {
          return ko.unwrap(date.headline);
        }),
        headline: computed(function() {
          return ko.unwrap(date.headline);
        }),
        type: computed(function() {
          return ko.unwrap(date.type);
        }),
        date: computed(function() {
          return vDate.prettyDate(result.startdate(), false, result.precisiondate());
        }),
        asset: computed(function() {
          return ko.unwrap(date.asset);
        }),
        fullDate: computed(function() {
          return result.startDate().getTime();
        }),
        text: computed(function() {
          return ko.unwrap(date.text);
        }),
        content: ko.observable(""),
        tag: computed(function() {
          return ko.unwrap(date.tag);
        }),
        slug: computed(function() {
          return ko.unwrap(date.slug);
        }),
        uniqueId: util.unique_ID(7),
        className: computed(function() {
          return ko.unwrap(date.className);
        })
      };
    };
    ko.bindingHandlers.dates = {
      init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var importedDates, innerBindingContext;

        importedDates = ko.observableArray();
        innerBindingContext = bindingContext.extend(function() {
          return {
            $importedDates: importedDates
          };
        });
        ko.applyBindingsToDescendants(innerBindingContext, element);
        return {
          controlsDescendantBindings: true
        };
      },
      update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {}
    };
    return ko.bindingHandlers.importDates = {
      init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return bindingContext.$importedDates($.Enumerable.From(ko.unwrap(valueAccessor())).Where(function(d) {
          return ko.unwrap(d.startDate) && !isNaN(vDate.parse(ko.unwrap(d.startDate), true).date);
        }).Select(function(d) {
          return parseDate(d);
        }).ToArray());
      },
      update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var dates;

        dates = ko.unwrap(valueAccessor());
        bindingContext.$importedDates.remove(function(d) {
          return dates.indexOf(d._date) < 0;
        });
        return $.Enumerable.From(dates).Where(function(d) {
          return !$.Enumerable.From(bindingContext.$importedDates()).Any(function(dd) {
            return dd._date === d;
          });
        }).Select(function(d) {
          return bindingContext.$importedDates.push(parseDate(d));
        }).ToArray();
      }
    };
  });

}).call(this);

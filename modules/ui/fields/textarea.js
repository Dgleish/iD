import * as d3 from 'd3';
import { getSetValue } from '../../util/get_set_value';
import { rebind } from '../../util/rebind';
import { t } from '../../util/locale';


export function textarea(field) {
    var dispatch = d3.dispatch('change'),
        input = d3.select(null);


    function textarea(selection) {
        input = selection.selectAll('textarea')
            .data([0]);

        input = input.enter()
            .append('textarea')
            .attr('id', 'preset-input-' + field.id)
            .attr('placeholder', field.placeholder() || t('inspector.unknown'))
            .attr('maxlength', 255)
            .on('input', change(true))
            .on('blur', change())
            .on('change', change())
            .merge(input);
    }


    function change(onInput) {
        return function() {
            var t = {};
            t[field.key] = getSetValue(input) || undefined;
            dispatch.call('change', this, t, onInput);
        };
    }


    textarea.tags = function(tags) {
        getSetValue(input, tags[field.key] || '');
    };


    textarea.focus = function() {
        input.node().focus();
    };


    return rebind(textarea, dispatch, 'on');
}

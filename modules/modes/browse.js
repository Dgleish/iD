import { t } from '../util/locale';
import { Hover, Lasso, Paste, Select } from '../behavior/index';
import { DragNode } from './index';

export function Browse(context) {
    var mode = {
        button: 'browse',
        id: 'browse',
        title: t('modes.browse.title'),
        description: t('modes.browse.description')
    }, sidebar;

    var behaviors = [
        Paste(context),
        Hover(context)
            .on('hover', context.ui().sidebar.hover),
        Select(context),
        Lasso(context),
        DragNode(context).behavior];

    mode.enter = function() {
        behaviors.forEach(function(behavior) {
            context.install(behavior);
        });

        // Get focus on the body.
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }

        if (sidebar) {
            context.ui().sidebar.show(sidebar);
        } else {
            context.ui().sidebar.select(null);
        }
    };

    mode.exit = function() {
        context.ui().sidebar.hover.cancel();
        behaviors.forEach(function(behavior) {
            context.uninstall(behavior);
        });

        if (sidebar) {
            context.ui().sidebar.hide();
        }
    };

    mode.sidebar = function(_) {
        if (!arguments.length) return sidebar;
        sidebar = _;
        return mode;
    };

    return mode;
}

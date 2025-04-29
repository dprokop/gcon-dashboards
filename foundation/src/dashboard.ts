import {
    DashboardBuilder,
    DashboardCursorSync,
} from '@grafana/grafana-foundation-sdk/dashboard';
import * as common from '@grafana/grafana-foundation-sdk/common';
import * as logs from '@grafana/grafana-foundation-sdk/logs';
import * as stat from '@grafana/grafana-foundation-sdk/stat';
import * as text from '@grafana/grafana-foundation-sdk/text';
import * as prometheus from '@grafana/grafana-foundation-sdk/prometheus';
import * as timeseries from '@grafana/grafana-foundation-sdk/timeseries';
import {
    logPanel,
    lokiDatasourceRef,
    lokiQuery,
    prometheusDatasourceRef,
    prometheusQuery,
    statPanel,
    textPanel,
    timeseriesPanel
} from './common';

export const exampleDashboard = (): DashboardBuilder => {
    const builder = new DashboardBuilder(`Test dashboard`)
        .uid(`test-dashboard`)
        .tags(['test', 'generated'])
        .readonly()
        .tooltip(DashboardCursorSync.Crosshair)
        .refresh('10s')
        .time({ from: 'now-30m', to: 'now' })
    ;

    builder
        .withPanel(grafanaGoroutinesTimeseries())
        .withPanel(descriptionText());

    return builder;  
};

export const prometheusVersionStat = (): stat.PanelBuilder => {
    return statPanel()
        .title('Prometheus version')
        .withTarget(
            instantPrometheusQuery(`prometheus_build_info{}`)
        )
        .transparent(true)
        .datasource(prometheusDatasourceRef())
        .reduceOptions(
            new common.ReduceDataOptionsBuilder()
                .calcs(['last'])
                .fields('/^version$/')
        )
    ;
};

 const instantPrometheusQuery = (expression: string): prometheus.DataqueryBuilder => {
    return new prometheus.DataqueryBuilder()
        .expr(expression)
        .instant()
        .format(prometheus.PromQueryFormat.Table)
        .legendFormat('__auto')
    ;
};

export const descriptionText = (): text.PanelBuilder => {
    return textPanel(`Text panels are supported too! Even with *markdown* text :)`)
        .transparent(true)
    ;
};

export const unfilteredLogs = (): logs.PanelBuilder => {
    return logPanel()
        .title('Logs')
        .withTarget(
            lokiQuery(`{job="app_logs"}`)
        )
        .datasource(lokiDatasourceRef())
    ;
};

export const grafanaGoroutinesTimeseries = (): timeseries.PanelBuilder => {
    return timeseriesPanel()
        .title('Grafana goroutines')
        .withTarget(
            prometheusQuery(`go_goroutines{job="grafana"}`)
        )
        .datasource(prometheusDatasourceRef())
    ;
};

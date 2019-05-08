import DashboardSubRoute from 'dashboard/mixins/dashboard-sub-route';
import AuthenticatedRoute from 'boot/routes/authenticated-base';

export default AuthenticatedRoute.extend(DashboardSubRoute, {
    tabLabel: 'Clinical trials',
    tabRoute: 'practiceDashboard.clinicalTrials'
});

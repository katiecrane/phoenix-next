import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';

import Dashboard from '../../Dashboard';
import Enclosure from '../../Enclosure';
import { FeedContainer } from '../../Feed'; // @TODO: rename to ActivityFeed or ActivityPage...
import { QuizContainer } from '../../Quiz';
import { BlockContainer } from '../../Block';
import { isCampaignClosed } from '../../../helpers';
import LedeBanner from '../../LedeBanner/LedeBanner';
import { ActionPageContainer } from '../../ActionPage';
import { CampaignSubPageContainer } from '../CampaignSubPage';
import TabbedNavigationContainer from '../../Navigation/TabbedNavigationContainer';
import CampaignFooter from '../../CampaignFooter';
import { PAGE_MODAL } from '../../Modal';

// TODO: If they click a modal link from the action page, this takes them to the root /.
// We should probably make a solution that lets them stay on the page they were already at.

const CampaignPage = (props) => {
  const {
    affiliatePartners, affiliateSponsors, blurb, campaignLead, coverImage,
    dashboard, endDate, isAffiliated, legacyCampaignId, match, openModal,
    slug, subtitle, template, title, totalCampaignSignups,
  } = props;

  const isClosed = isCampaignClosed(get(endDate, 'date', null));

  return (
    <div>
      <LedeBanner
        isAffiliated={isAffiliated}
        title={title}
        subtitle={subtitle}
        blurb={blurb}
        coverImage={coverImage}
        legacyCampaignId={legacyCampaignId}
        endDate={endDate}
        template={template}
        affiliateSponsors={affiliateSponsors}
      />

      <div className="main">
        { dashboard ?
          <Dashboard
            totalCampaignSignups={totalCampaignSignups}
            content={dashboard}
            endDate={endDate}
          />
          : null }

        <TabbedNavigationContainer campaignSlug={slug} />

        <Enclosure className="default-container margin-top-lg margin-bottom-lg">
          <Switch>
            <Route
              path={`${match.url}`}
              exact
              render={() => (template === 'legacy' ?
                <ActionPageContainer />
                :
                <FeedContainer />
              )}
            />
            <Route
              path={`${match.url}/action`}
              render={() => (isClosed ?
                <Redirect to={`${match.url}`} />
                :
                <ActionPageContainer />
              )}
            />
            <Route path={`${match.url}/pages/:slug`} component={CampaignSubPageContainer} />
            <Route path={`${match.url}/blocks/:id`} component={BlockContainer} />
            <Route path={`${match.url}/quiz/:slug`} component={QuizContainer} />
            <Route
              path={`${match.url}/modal/:id`}
              render={(routingProps) => {
                openModal(PAGE_MODAL, routingProps.match.params.id);
                return <Redirect to={`${match.url}`} />;
              }}
            />
          </Switch>
        </Enclosure>
      </div>

      <CampaignFooter
        affiliateSponsors={affiliateSponsors}
        affiliatePartners={affiliatePartners}
        campaignLead={campaignLead}
      />
    </div>
  );
};

CampaignPage.propTypes = {
  blurb: PropTypes.string.isRequired,
  coverImage: PropTypes.shape({
    description: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
  dashboard: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    fields: PropTypes.object,
  }),
  endDate: PropTypes.shape({
    date: PropTypes.string,
    timezone: PropTypes.string,
    timezone_type: PropTypes.number,
  }),
  campaignLead: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  isAffiliated: PropTypes.bool,
  affiliateSponsors: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  affiliatePartners: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  legacyCampaignId: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  slug: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  template: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  totalCampaignSignups: PropTypes.number,
  openModal: PropTypes.func.isRequired,
};

CampaignPage.defaultProps = {
  dashboard: null,
  endDate: null,
  isAffiliated: false,
  totalCampaignSignups: 0,
  campaignLead: undefined,
};

export default CampaignPage;

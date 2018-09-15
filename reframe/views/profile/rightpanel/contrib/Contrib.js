import React from 'react';
import * as moment from 'moment';

import Badge from './Badge';
import RepoDescrAndDetails from './RepoDescrAndDetails';
import './Contrib.css';
import Avatar from '../../Avatar';
import AvatarAdd from '../../AvatarAdd';
import * as db from '../../../db';
//import {withSeparator} from '../../css';
import {bigNum, roundHalf} from '../../numbers';
import {urls} from '../../../../ghuser';
import {Badges, BadgesMini, getDisplaySettings, BadgesMultiLine} from './badges/Badges';
import RichText from './RichText';
import {Accordion, AccordionIcon} from './Accordion';
import Language from './Language';
import AddSettings from '../../AddSettings';

const LEFT_PADDING = 67;

class Contrib extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      repo: null
    };
  }

  componentDidMount() {
    this.props.pushToFunctionQueue(0, async () => {
      try {
        const repoData = await fetch(`${db.url}/repos/${this.props.contrib.full_name}.json`);
        const repo = await repoData.json();
        this.setState({ repo });
      } catch (_) {}
      this.setState({ loading: false });
    });
  }

  render() {
    if( ! this.state.loading && this.state.repo && getDisplaySettings(this.props.contrib).miniDisplay ) {
        return <ContribMini {...{...this.props, ...this.state}}/>;
    }

    const strStars = numStars => `★ ${bigNum(numStars)}`;
    const strLastPushed = pushedAt => `last pushed ${moment(pushedAt).fromNow()}`;
    const strNumCommits = numCommits => `${bigNum(numCommits)} non-merge commits`;

    const avatar = () => {
      if (this.state.loading) {
        return <span className="contrib-name mb-2 mr-2"><i className="fas fa-spinner fa-pulse"></i></span>;
      }
      if (this.state.repo && this.state.repo.settings && this.state.repo.settings.avatar_url) {
        return <Avatar url={this.state.repo.settings.avatar_url} classes="avatar-small" />;
      }
      if (this.state.repo && this.state.repo.organization &&
          this.state.repo.organization.avatar_url) {
        return <Avatar url={this.state.repo.organization.avatar_url} classes="avatar-small" />;
      }
      return <a href={`${urls.docs}/repo-settings.md`} title="Add an avatar"
                target="_blank"><AvatarAdd/></a>;
    };

    const badges = (owner, isFork, percentage, numContributors, popularity, numStars, activity,
                    pushedAt, maturity, numCommits, isMaintainer) => {
      const result = [];
      if (!isFork && this.props.username === owner || percentage >= 80) {
        result.push(
            <Badge key="percentage" classes="badge-success contrib-name" text="owner"
                   tooltip={`${this.props.username} wrote ${roundHalf(percentage)}% of it`}/>
        );
      } else if (isMaintainer) {
        result.push(
            <Badge key="percentage" classes="badge-danger contrib-name" text="maintainer"
                   tooltip={`${this.props.username} wrote ${roundHalf(percentage)}% of it`}/>
        );
      }
      if (numContributors > 1) {
        result.push(<Badge key="collaborative" classes="badge-secondary contrib-name"
                           text="collaborative"
                           tooltip={`${numContributors} people worked on it`}/>);
      }
      if (popularity > 2.5) {
        result.push(<Badge key="popular" classes="badge-secondary contrib-name" text="popular"
                           tooltip={strStars(numStars)}/>);
      }
      if (activity > 2.5) {
        result.push(<Badge key="active" classes="badge-secondary contrib-name" text="active"
                           tooltip={strLastPushed(pushedAt)}/>);
      }
      if (maturity > 2.5) {
        result.push(<Badge key="mature" classes="badge-secondary contrib-name" text="mature"
                           tooltip={strNumCommits(numCommits)}/>);
      }
      return result;
    };

    const earnedStars = (percentage, numStars) => {
      let earned = percentage * numStars / 100;
      if (earned < .5) {
        return '';
      }

      earned = bigNum(earned);
      const total = bigNum(numStars);
      let displayStr = `★ ${earned}`;
      if (earned !== total) {
        displayStr += ` / ${total}`;
      }

      return (
        <span className="ml-2 mb-2 contrib-name text-gray">{displayStr}</span>
      );
    };

    const userIsMaintainer = this.props.contrib.percentage >= 15;

    /*
    const bodyLine = (
      <div>
        <Badges contrib={this.props.contrib} username={this.props.username}/>
        <AccordionIcon/>
      </div>
    );
    */
    const bodyLine = (
      <Badges contrib={this.props.contrib} username={this.props.username}/>
    );
    const bodyContent = (
      <div style={{paddingTop: 15}}>
        <Languages repo={this.state.repo} style={{marginBottom: 9, marginTop: -4}}/>
        <BadgesMultiLine contrib={this.props.contrib} username={this.props.username}/>
      </div>
    );
    const body = (
        <Accordion
          pushToFunctionQueue={this.props.pushToFunctionQueue}
          head={bodyLine}
          content={bodyContent}
        />
    );

    return (
      <div className="border-bottom border-gray-light" style={{paddingBottom: 15, paddingTop: 15, paddingLeft: LEFT_PADDING, position: 'relative'}}>
        <div style={{position: 'absolute', top: 0, left: 0, paddingTop: 'inherit'}}>
          {avatar()}
        </div>
        <ContribHeader {...{...this.props, ...this.state}}/>
        {/*
        <h4 className="contrib-name mr-1">
          <a href={`https://github.com/${this.props.contrib.full_name}`}
             target="_blank" className="text-bold contrib-name external"
             title={this.props.contrib.full_name}>{this.props.contrib.name}</a>
          {
            this.state.repo && this.state.repo.fork &&
              <i className="fas fa-code-branch contrib-name ml-2 text-gray" title="fork"></i>
          }
        </h4>
        */}
        {
          /*
          this.state.repo &&
            badges(this.state.repo.owner, this.state.repo.fork, this.props.contrib.percentage,
                   Object.keys(this.state.repo.contributors).length, this.props.contrib.popularity,
                   this.state.repo.stargazers_count, this.props.contrib.activity,
                   this.state.repo.pushed_at, this.props.contrib.maturity,
                   this.props.contrib.total_commits_count, userIsMaintainer)
          */
        }
        {
          /*
          this.state.repo &&
            earnedStars(this.props.contrib.percentage, this.state.repo.stargazers_count)
          */
        }
        {body}
        {
          /*
          this.state.repo &&
            <RepoDescrAndDetails contrib={this.props.contrib} descr={this.state.repo.description}
              languages={this.state.repo.languages}
              techs={this.state.repo.settings && this.state.repo.settings.techs || []}
              pulls_authors={this.state.repo.pulls_authors}
              strStars={strStars(this.state.repo.stargazers_count)}
              strLastPushed={strLastPushed(this.state.repo.pushed_at)}
              strNumCommits={strNumCommits(this.props.contrib.total_commits_count)}
              username={this.props.username} userIsMaintainer={userIsMaintainer}
              pushToFunctionQueue={this.props.pushToFunctionQueue}/>
          */
        }
      </div>
    );
  }
}

function ContribMini(props) {
    const badgeLine = (
      <BadgesMini
        style={{position: 'absolute', left: 0, top:0, paddingTop: 'inherit', width: 50}}
        contrib={props.contrib}
        username={props.username}
      />
    );
    return (
        <div
          className="border-bottom border-gray-light"
          style={{paddingBottom: 0, paddingTop: 3, paddingBottom: 3, position: 'relative', paddingLeft: LEFT_PADDING}}
        >
          {badgeLine}
          <ContribHeader {...props}/>
        </div>
    );
}


function ContribHeader({username, contrib: {name, full_name}, repo}) {
      if( ! repo ) {
          return null;
      }
      const display_name = repo.owner===username ? name : full_name;
      return (
          <div
            style={{whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}}
          >
            <a href={`https://github.com/${full_name}`}
               className="external"
               target="_blank">
               { repo.owner !== username &&
                   repo.owner+'/'
               }
               <span className="text-bold">{name}</span>
            </a>
            &nbsp; &nbsp;
            <span
              className="repo-descr text-gray"
            >{RichText(repo.description)}</span>
          </div>
      );
}

function Languages({repo, style={}}) {

    const languageViews = [];

    const languages = repo && repo.languages;

    const techs = repo && repo.settings && repo.settings.techs;

    if (languages) {
      for (const language of Object.keys(languages)) {
        languageViews.push(<Language key={language} name={language}
                       color={languages[language].color} />);
      }
    }
    if( techs ) {
      for (const tech of techs) {
        languageViews.push(<Language key={tech} name={tech}
                                 color="#ccc" />);
      }
    }

    if( languageViews.length === 0 ) {
      return null;
    }

    return (
      <div style={{paddingLeft: 3, ...style}}>
        {languageViews}
        <AddSettings href={`${urls.docs}/repo-settings.md`} title="Add a tech" />
      </div>
    );
}

export default Contrib;

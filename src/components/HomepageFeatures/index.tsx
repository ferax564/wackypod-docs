import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
  emoji: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'REST API',
    emoji: '',
    description: (
      <>
        Full-featured REST API for creating episodes, managing playlists,
        configuring webhooks, and automating podcast generation from any
        content source.
      </>
    ),
  },
  {
    title: 'Python SDK',
    emoji: '',
    description: (
      <>
        Official Python SDK with typed models, async polling, comprehensive
        error handling, and IDE autocompletion. Install with{' '}
        <code>pip install wackypod</code>.
      </>
    ),
  },
  {
    title: 'Multiple Integrations',
    emoji: '',
    description: (
      <>
        Chrome Extension for one-click conversion, Zapier for no-code
        automation, native iOS app with on-device AI, and RSS feeds for
        podcast apps.
      </>
    ),
  },
];

function Feature({title, emoji, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center" style={{fontSize: '3rem', marginBottom: '0.5rem'}}>
        {emoji}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

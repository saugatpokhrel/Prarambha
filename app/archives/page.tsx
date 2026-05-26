"use client";

import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import VideoSection from '@/components/archives/VideoSection';
import { Video } from '../../types';

const sampleVideos: Video[] = [
  {
    id: '1',
    title: 'Posing With Glasses BEI edition',
    description: 'funnnn',
    thumbnailUrl: '/photos/shivam.png',
    videoUrl: '/videos/KalaChasmaBei.mp4',
    date: '2024-07-06'
  },
  {
    id: '2',
    title: 'Transition BCT',
    description: 'Ofcourse Transition is mandatory',
    thumbnailUrl: '/photos/transition.png',
    videoUrl: '/videos/TransitionBct.mp4',
    date: '2024-07-06'
  },
  {
    id: '3',
    title: 'Sigma Praches Sir ',
    description: 'Praches sir dancing With BEI/BCT Sambdhi',
    thumbnailUrl: '/photos/Sir.png',
    videoUrl: '/videos/SirDance.mp4',
    date: '2024-07-06'
  },
  {
    id: '4',
    title: 'Uno Reverse',
    description: 'Boys to Girls Ratio is crazyyy',
    thumbnailUrl: '/photos/bctGirls.jpeg',
    videoUrl: '/videos/UnoReverse.mp4',
    date: '2024-07-06',
  },
  {
    id: '5',
    title: 'Posing With Glasses BCT edition',
    description: 'Kala Chasmaaa',
    thumbnailUrl: '/photos/Kushal.jpg',
    videoUrl: '/videos/KalaChasma.mp4',
    date: '2024-07-06',
  },
  {
    id: '6',
    title: 'Wowwwww Moments',
    description: 'Just Shouting Out loud With Seniors',
    thumbnailUrl: '/photos/bctSenior.jpeg',
    videoUrl: '/videos/photo-montage.mp4',
    date: '2024-07-06',
  }
];

export default function ArchivesPage() {
  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-black pt-32 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Event Archives
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore and relive the exciting moments from our past Prarambha events.
            </p>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <VideoSection videos={sampleVideos} />
    </PageTransition>
  );
}

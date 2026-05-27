import PageTransition from '@/components/layout/PageTransition';
import NoticeCard from '@/components/notices/NoticeCard';
import { Notice } from '../../types';

const noticesData: Notice[] = [
  {
    id: '1',
    title: 'Welcome Program Date Announcement Coming Soon',
    content:
      'The official date for the Prarambha will be announced within the next two weeks. Stay tuned for updates!',
    date: 'May 25, 2026',
    priority: 'medium',
  },
  {
    id: '2',
    title: 'Venue Confirmation',
    content:
      'Event venue details will be shared shortly through official notices',
    date: 'May 25, 2026',
    priority: 'low',
  },
  {
    id: '3',
    title: 'Call for Student Volunteers',
    content:
      'We are looking for enthusiastic students to help organize and run Prarambha. If interested, please submit your application by May 8, 2025.',
    date: 'May 25, 2026',
    priority: 'high',
  },
  {
    id: '4',
    title: 'Sponsorship Opportunities Available',
    content:
      'Organizations interested in sponsoring Prarambha can find details about various sponsorship packages on our website. Limited slots available.',
    date: 'March 1, 2026',
    priority: 'medium',
  },
  {
    id: '5',
    title: 'Event Committee Formation',
    content:
      'The organizing committee for Prarambha 2082 has been formed. Committee members will meet next week to finalize the event details.',
    date: 'March 1, 2026',
    priority: 'low',
  },
];

export default function NoticesPage() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Notices & Updates
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300">
              Stay informed with the latest announcements regarding the Welcome
              Program.
            </p>
          </div>

          <div className="space-y-6">
            {noticesData.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

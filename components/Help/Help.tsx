import { BookOpen } from "lucide-react";
import { Button } from "@/components/Button/page";
import { CustomCard } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const helpTopics = [
  {
    id: 1,
    title: "Basics",
    icon: <BookOpen className="w-6 h-6 text-blue-600" />,
  },
  {
    id: 2,
    title: "Data and Privacy",
    icon: <Image src="/icons/privacy-tip.svg" alt="Data and Privacy" width={24} height={24} />,
  },
  {
    id: 3,
    title: "Messages",
    icon: <Image src="/icons/typcn_messages.svg" alt="Messages" width={24} height={24} />,
  },
  {
    id: 4,
    title: "Your Profile",
    icon: <Image src="/icons/profile-bold.svg" alt="Your Profile" width={24} height={24} />,
  },
  {
    id: 5,
    title: "Connections",
    icon: <Image src="/icons/friends-filled.svg" alt="Connections" width={24} height={24} />,
  },
  {
    id: 6,
    title: "Live Chats",
    icon: <Image src="/icons/mdi_chat.svg" alt="Live Chats" width={24} height={24} />,
  },
];

const HelpBanner = () => (
  <div className="bg-blue-600 h-12 w-full max-w-7xl mx-auto text-white px-6 md:px-12 py-3 mt-6 md:rounded">
    <div className="flex items-center space-x-4">
      <span className="text-lg font-medium">We are here to help</span>
      <Image src="/icons/help-q.svg" alt="Help" width={24} height={24} />
    </div>
  </div>
);

const HelpTopicCard = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
  <CustomCard className="hover:shadow-md transition-shadow bg-white border border-[#00000080] cursor-pointer flex items-center justify-center text-center h-[141px]">
    <div className="flex flex-col items-center gap-2 md:gap-4">
      {icon}
      <span className="text-sm md:text-base">{title}</span>
    </div>
  </CustomCard>
);

const SafetyCenter = () => (
  <div className="w-full md:w-[271px] flex flex-row md:flex-col items-start gap-4 bg-white py-4 lg:py-6 shadow-sm px-4 md:px-6">
    <div className="flex-shrink-0">
      <Image src="/icons/safety-outlined.svg" alt="Safety" width={32} height={32} />
    </div>
    <div className="flex flex-col gap-3 text-gray-600">
      <h3 className="text-xl font-medium text-black">Safety Center</h3>
      <p className="text-base mb-4 md:w-40">
        Your account safety is our top priority
      </p>
      <Link href="/help" className="text-blue-600 font-light hover:underline">
        Learn more
      </Link>
    </div>
  </div>
);

const HelpTopicsSection = () => (
  <div className="flex-1">
    <div className="flex justify-between items-center mb-6">
      <Button variant="link" className="text-blue-600 text-base p-0 hover:underline">
        View all
      </Button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {helpTopics.map((topic) => (
        <HelpTopicCard key={topic.id} title={topic.title} icon={topic.icon} />
      ))}
    </div>
  </div>
);

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#f3f3fb]">
      <HelpBanner />

      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row px-6 gap-8">
          <HelpTopicsSection />
          <SafetyCenter />
        </div>
      </main>
    </div>
  );
}
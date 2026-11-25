import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProposalPage from '@/components/proposal/ProposalPage';
import { PROPOSALS, getProposal } from '@/lib/proposals';
import { site } from '@/lib/site';
import '../../home.css';
import '../../../components/consult/consult.css';
import '../proposal.css';

export const dynamicParams = false;
export const generateStaticParams = () => PROPOSALS.map((p) => ({ company: p.slug }));

type Props = { params: Promise<{ company: string }> };

/** Private proposals: never indexed. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProposal((await params).company);
  if (!p) return {};
  return {
    title: `The $5M Growth Plan for ${p.company} | WeframeTech`,
    description: `A four-part plan to help ${p.company} build toward $5M in annual revenue within 12 months: B2B enquiries, automation, a direct sales channel and global expansion.`,
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: Props) {
  const p = getProposal((await params).company);
  if (!p) notFound();
  return <ProposalPage proposal={p} bookingUrl={process.env.NEXT_PUBLIC_PROPOSAL_BOOKING_URL || site.bookingUrl || undefined} />;
}

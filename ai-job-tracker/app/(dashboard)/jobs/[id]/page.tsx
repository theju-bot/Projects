import { JobDetailPanel } from '@/components/jobs/JobDetailPanel'

type Props = {
  params: Promise<{ id: string }>
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params

  return (
    <div className='max-w-4xl mx-auto'>
      <JobDetailPanel jobId={id} />
    </div>
  )
}

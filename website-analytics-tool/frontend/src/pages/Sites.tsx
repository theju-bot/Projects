import { useEffect, useState, useTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useSites from '../hooks/useSites'
import { useAppDispatch } from '../store/hooks'
import { setSelectedSite } from '../store/slices/sitesSlice'
import type { Site } from '../types/types'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Field, FieldLabel, FieldError } from '../components/ui/field'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'

const siteSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  domain: z.string().min(1, 'Domain is required'),
})

type SiteForm = z.infer<typeof siteSchema>

const getScript = (siteId: string) => `<script>
(function () {
  const SITE_ID = '${siteId}'
  const API_URL = '${import.meta.env.VITE_API_URL}/events'

  function getOS() {
    if (navigator.userAgentData?.platform) return navigator.userAgentData.platform
    const ua = navigator.userAgent
    if (/Android/.test(ua)) return 'Android'
    if (/iPhone|iPad|iPod/.test(ua)) return 'iOS'
    if (/Windows/.test(ua)) return 'Windows'
    if (/Mac/.test(ua)) return 'MacOS'
    if (/Linux/.test(ua)) return 'Linux'
    return 'Unknown'
  }

  function getBrowser() {
    if (navigator.userAgentData?.brands) {
      const brands = navigator.userAgentData.brands
      if (brands.some(function(b) { return /Edg/i.test(b.brand) })) return 'Edge'
      if (brands.some(function(b) { return /Opera|OPR/i.test(b.brand) })) return 'Opera'
      if (brands.some(function(b) { return /Chrome|Chromium/i.test(b.brand) })) return 'Chrome'
      if (brands.some(function(b) { return /Firefox/i.test(b.brand) })) return 'Firefox'
    }
    const ua = navigator.userAgent
    if (/Edg\\//.test(ua)) return 'Edge'
    if (/OPR\\/|Opera/.test(ua)) return 'Opera'
    if (/Firefox\\//.test(ua)) return 'Firefox'
    if (/Chrome\\//.test(ua) && !/Chromium/.test(ua)) return 'Chrome'
    if (/Chromium\\//.test(ua)) return 'Chromium'
    if (/Safari\\//.test(ua) && !/Chrome/.test(ua)) return 'Safari'
    return 'Unknown'
  }

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      siteId: SITE_ID,
      type: 'pageview',
      path: window.location.pathname,
      referrer: document.referrer,
      browser: getBrowser(),
      os: getOS(),
    }),
  })
})()
</script>`

const Sites = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState('')

  const { sites, isLoading, deleteMutation, createMutation } = useSites()

  useEffect(() => {
    document.title = 'Your Sites — Analytics'
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SiteForm>({
    resolver: zodResolver(siteSchema),
    defaultValues: { name: '', domain: '' },
  })

  const onSubmit = (data: SiteForm) => {
    startTransition(async () => {
      try {
        await createMutation.mutateAsync(data)
        reset()
        setOpen(false)
      } catch (err) {
        console.error(err)
        setServerError('Failed to create site.')
      }
    })
  }

  const handleSiteClick = (site: Site) => {
    dispatch(setSelectedSite(site))
    navigate(`/dashboard/${site._id}`)
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Your Sites</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Site</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Site</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-4'
            >
              <Field>
                <FieldLabel>Site Name</FieldLabel>
                <Input {...register('name')} placeholder='My Website' />
                <FieldError errors={[errors.name]} />
              </Field>

              <Field>
                <FieldLabel>Domain</FieldLabel>
                <Input {...register('domain')} placeholder='example.com' />
                <FieldError errors={[errors.domain]} />
              </Field>

              <FieldError errors={[{ message: serverError }]} />

              <Button type='submit' disabled={isPending} className='w-full'>
                {isPending ? 'Creating...' : 'Create Site'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <p className='text-muted-foreground'>Loading...</p>}

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {sites.map((site) => (
          <Card
            key={site._id}
            className='cursor-pointer hover:border-primary transition-colors'
            onClick={() => handleSiteClick(site)}
          >
            <CardHeader>
              <CardTitle>{site.name}</CardTitle>
              <CardDescription>{site.domain}</CardDescription>
            </CardHeader>
            <CardContent className='flex justify-between'>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={(e) => e.stopPropagation()}
                  >
                    Get Script
                  </Button>
                </DialogTrigger>
                <DialogContent
                  onClick={(e) => e.stopPropagation()}
                  className='flex flex-col gap-4 max-h-[80vh]'
                >
                  <DialogHeader>
                    <DialogTitle>Tracking Script</DialogTitle>
                  </DialogHeader>
                  <p className='text-sm text-muted-foreground'>
                    Paste this inside the <code>&lt;head&gt;</code> of your
                    website.
                  </p>
                  <pre className='bg-muted text-sm rounded-md p-4 overflow-y-auto flex-1 whitespace-pre-wrap break-all'>
                    {getScript(site._id)}
                  </pre>
                  <Button
                    variant='outline'
                    onClick={() =>
                      navigator.clipboard.writeText(getScript(site._id))
                    }
                  >
                    Copy Script
                  </Button>
                </DialogContent>{' '}
              </Dialog>

              <Button
                variant='destructive'
                size='sm'
                onClick={(e) => {
                  e.stopPropagation()
                  deleteMutation.mutate(site._id)
                }}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Sites

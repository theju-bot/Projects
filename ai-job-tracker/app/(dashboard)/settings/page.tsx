import { ProfileForm } from '@/components/settings/ProfileForm'
import { OpenRouterKeyForm } from '@/components/settings/OpenRouterKeyForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Settings</h1>
        <p className='text-muted-foreground mt-1'>
          Manage your profile and AI preferences
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            This information helps generate better AI suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>OpenRouter API Key</CardTitle>
          <CardDescription>
            Add your OpenRouter key to unlock AI features. Get one at{' '}
            <a
              href='https://openrouter.ai'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              openrouter.ai
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OpenRouterKeyForm />
        </CardContent>
      </Card>
    </div>
  )
}

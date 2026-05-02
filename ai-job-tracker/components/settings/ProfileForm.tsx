'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '@/lib/auth/auth-client'
import { updateProfileSchema } from '@/lib/validations/user.schema'
import type { UpdateProfileInput } from '@/types/user.types'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { set } from 'mongoose'

export function ProfileForm() {
  const [isPending, setIsPending] = useState(false)
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
  })

  useEffect(() => {
    async function loadProfile() {
      const { data: session } = await authClient.getSession()
      if (session?.user) {
        setValue('targetRole', session.user.targetRole || '')
        setValue('yearsOfExperience', session.user.yearsOfExperience || 0)
        setValue('bio', session.user.bio || '')
        setValue('preferredModel', session.user.preferredModel || '')
        setSkills(session.user.skills || [])
        setValue('skills', session.user.skills || [])
      }
    }
    loadProfile()
  }, [setValue])

  function addSkill() {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      const updated = [...skills, skillInput.trim()]
      setSkills(updated)
      setValue('skills', updated)
      setSkillInput('')
    }
  }

  function removeSkill(skill: string) {
    const updated = skills.filter((s) => s !== skill)
    setSkills(updated)
    setValue('skills', updated)
  }

  async function onSubmit(data: UpdateProfileInput) {
    setIsPending(true)
    const { error } = await authClient.updateUser(data)

    if (error) {
      toast.error(error.message ?? 'Failed to update profile')
    } else {
      toast.success('Profile updated')
    }
    setIsPending(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <Field>
        <FieldLabel>Target Role</FieldLabel>
        <Input placeholder='Frontend Developer' {...register('targetRole')} />
        <FieldError errors={[{ message: errors.targetRole?.message }]} />
      </Field>

      <Field>
        <FieldLabel>Skills</FieldLabel>
        <div className='flex gap-2'>
          <Input
            placeholder='Add a skill'
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addSkill()
              }
            }}
          />
          <Button type='button' onClick={addSkill}>
            Add
          </Button>
        </div>
        <div className='flex flex-wrap gap-2 mt-2'>
          {skills.map((skill) => (
            <div
              key={skill}
              className='flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm'
            >
              <span>{skill}</span>
              <button
                type='button'
                onClick={() => removeSkill(skill)}
                className='hover:text-destructive'
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <FieldError errors={[{ message: errors.skills?.message }]} />
      </Field>

      <Field>
        <FieldLabel>Years of Experience</FieldLabel>
        <Input
          type='number'
          min={0}
          max={50}
          {...register('yearsOfExperience', { valueAsNumber: true })}
        />
        <FieldError errors={[{ message: errors.yearsOfExperience?.message }]} />
      </Field>

      <Field>
        <FieldLabel>Bio</FieldLabel>
        <Textarea
          placeholder='Tell us about yourself...'
          rows={4}
          {...register('bio')}
        />
        <FieldError errors={[{ message: errors.bio?.message }]} />
      </Field>

      <Field>
        <FieldLabel>Preferred AI Model</FieldLabel>
        <Input placeholder='openrouter/free' {...register('preferredModel')} />
        <FieldError errors={[{ message: errors.preferredModel?.message }]} />
      </Field>

      <Button type='submit' disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  )
}

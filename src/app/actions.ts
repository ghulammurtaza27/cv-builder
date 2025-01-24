'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { ResumeData } from '@/types/resume'

export async function saveResume(data: ResumeData) {
  // In a real app, this would save to a database
  cookies().set('resume-data', JSON.stringify(data))
  revalidatePath('/')
}

export async function loadResume(): Promise<ResumeData | null> {
  const data = cookies().get('resume-data')
  return data ? JSON.parse(data.value) : null
}


import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PostCard from '../components/PostCard'

describe('PostCard', () => {
  it('renders post title and content', () => {
    const post = {
      id: '1',
      title: 'Test Post',
      content: 'Test content',
      createdAt: new Date().toISOString(),
      author: { name: 'Test User' }
    }
    
    render(<PostCard post={post} />)
    
    expect(screen.getByText('Test Post')).toBeDefined()
    expect(screen.getByText('Test content')).toBeDefined()
  })
})
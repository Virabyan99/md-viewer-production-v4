import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { IconMarkdown } from '@tabler/icons-react';

const Homepage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-foreground">
      <IconMarkdown className="w-24 h-24 mb-4" aria-hidden="true" />
      <h1 className="text-4xl font-bold mb-4">Welcome to Markdown Viewer</h1>
      <p className="text-lg mb-8">View and edit your Markdown files with ease.</p>
      <Button asChild size="lg">
        <Link href="/viewer">Get Started</Link>
      </Button>
    </div>
  );
};

export default Homepage;
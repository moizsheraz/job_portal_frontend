import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';

interface CompanyProps {
  company: {
    _id: string;
    name: string;
    logo: string;
    industry: string;
    location: string;
    website: string;
    description: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
}

const CompanyCard: React.FC<CompanyProps> = ({ company, onEdit, onDelete, isOwner = false }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-card">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="relative w-16 h-16">
          <Image
            src={company.logo || '/default-company-logo.png'}
            alt={`${company.name} logo`}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex-1">
          <CardTitle className="text-2xl font-bold">{company.name}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {company.industry} • {company.location}
          </CardDescription>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-card-foreground">{company.description}</p>
        <div className="flex items-center gap-2">
          <Link 
            href={company.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Visit Website
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard; 
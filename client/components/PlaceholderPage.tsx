import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface PlaceholderPageProps {
  title: string;
  description: string;
  features?: string[];
  icon?: React.ElementType;
}

export function PlaceholderPage({ 
  title, 
  description, 
  features = [], 
  icon: Icon = Construction 
}: PlaceholderPageProps) {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card className="text-center">
          <CardHeader className="py-12">
            <div className="mx-auto w-16 h-16 bg-recovery-accent/10 rounded-full flex items-center justify-center mb-6">
              <Icon className="h-8 w-8 text-recovery-accent" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">{title}</CardTitle>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
          </CardHeader>
          
          {features.length > 0 && (
            <CardContent className="pb-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Planned Features:</h3>
                <ul className="text-left space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-recovery-accent rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-8 p-4 bg-recovery-bg/50 rounded-lg">
                <p className="text-sm text-gray-600">
                  This page is under development. Continue prompting to request implementation of specific features you'd like to see!
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}

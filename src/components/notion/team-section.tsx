'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Linkedin, Mail, Award } from 'lucide-react';
import { getTeamMembers } from '@/lib/notion-cms';
import { getImageForContent } from '@/lib/pexels';
import type { NotionTeamMember } from '@/lib/notion-cms';

interface TeamSectionProps {
  maxItems?: number;
  showBio?: boolean;
  showContact?: boolean;
  showSpecialties?: boolean;
}

export default function NotionTeamSection({ 
  maxItems = 4, 
  showBio = true, 
  showContact = true,
  showSpecialties = true 
}: TeamSectionProps) {
  const [teamMembers, setTeamMembers] = useState<NotionTeamMember[]>([]);
  const [memberImages, setMemberImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTeamMembers() {
      try {
        const teamData = await getTeamMembers();
        const displayMembers = teamData.slice(0, maxItems);
        setTeamMembers(displayMembers);

        // Load images for team members
        const imagePromises = displayMembers.map(async (member) => {
          const imageType = member.imageType || 'business professional';
          const image = await getImageForContent(imageType);
          return { id: member.id, image: image?.url || '' };
        });

        const imageResults = await Promise.all(imagePromises);
        const imageMap = imageResults.reduce((acc, { id, image }) => {
          acc[id] = image;
          return acc;
        }, {} as Record<string, string>);

        setMemberImages(imageMap);
      } catch (error) {
        console.error('Error loading team members:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTeamMembers();
  }, [maxItems]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: maxItems }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 rounded-2xl p-6 text-center">
              <div className="w-24 h-24 bg-gray-400 rounded-full mx-auto mb-4"></div>
              <div className="h-6 bg-gray-400 rounded mb-2"></div>
              <div className="h-4 bg-gray-400 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-400 rounded"></div>
                <div className="h-3 bg-gray-400 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No team members available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {teamMembers.map((member, index) => {
        const memberImage = memberImages[member.id];

        return (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Profile Image */}
            <div className="relative mb-6">
              {memberImage ? (
                <img
                  src={memberImage}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-12 h-12 text-primary-600" />
                </div>
              )}
              
              {/* Experience Badge */}
              {member.yearsExperience && (
                <div className="absolute -bottom-2 -right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {member.yearsExperience}+ yrs
                </div>
              )}
            </div>

            {/* Name and Position */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {member.name}
            </h3>
            <p className="text-primary-600 font-medium mb-4">
              {member.position}
            </p>

            {/* Bio */}
            {showBio && member.bio && (
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {member.bio}
              </p>
            )}

            {/* Specialties */}
            {showSpecialties && member.specialties && member.specialties.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Specialties:</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {member.specialties.slice(0, 3).map((specialty, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {member.certifications && member.certifications.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    {member.certifications.length} Certifications
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {member.certifications.slice(0, 2).map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                    >
                      {cert}
                    </span>
                  ))}
                  {member.certifications.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{member.certifications.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Contact Links */}
            {showContact && (
              <div className="flex justify-center gap-4 pt-4 border-t border-gray-100">
                {member.linkedIn && (
                  <a
                    href={member.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
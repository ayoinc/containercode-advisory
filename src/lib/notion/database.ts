import { Client } from '@notionhq/client';

export interface NotionContact {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  services: string[];
  budget?: string;
  timeline?: string;
  status: 'new' | 'contacted' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: string;
}

export interface NotionSubscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  interests: string[];
  status: 'active' | 'paused' | 'unsubscribed';
  source: string;
}

export interface NotionNewsletter {
  title: string;
  content: string;
  excerpt: string;
  topics: string[];
  status: 'draft' | 'published' | 'scheduled';
  publishDate?: string;
  sentCount: number;
  generatedBy: 'ai' | 'manual';
}

export class NotionService {
  private notion: Client;
  private contactsDbId: string;
  private subscribersDbId: string;
  private newslettersDbId: string;

  constructor(
    notionToken: string,
    contactsDbId: string,
    subscribersDbId: string,
    newslettersDbId: string
  ) {
    this.notion = new Client({ auth: notionToken });
    this.contactsDbId = contactsDbId;
    this.subscribersDbId = subscribersDbId;
    this.newslettersDbId = newslettersDbId;
  }

  async createContact(contact: NotionContact): Promise<string> {
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: this.contactsDbId },
        properties: {
          'Name': {
            title: [
              {
                text: {
                  content: `${contact.firstName} ${contact.lastName}`,
                },
              },
            ],
          },
          'First Name': {
            rich_text: [
              {
                text: {
                  content: contact.firstName,
                },
              },
            ],
          },
          'Last Name': {
            rich_text: [
              {
                text: {
                  content: contact.lastName,
                },
              },
            ],
          },
          'Email': {
            email: contact.email,
          },
          'Company': {
            rich_text: contact.company ? [
              {
                text: {
                  content: contact.company,
                },
              },
            ] : [],
          },
          'Phone': {
            phone_number: contact.phone || null,
          },
          'Subject': {
            rich_text: [
              {
                text: {
                  content: contact.subject,
                },
              },
            ],
          },
          'Message': {
            rich_text: [
              {
                text: {
                  content: contact.message,
                },
              },
            ],
          },
          'Services': {
            multi_select: contact.services.map(service => ({ name: service })),
          },
          'Budget': {
            select: contact.budget ? { name: contact.budget } : null,
          },
          'Timeline': {
            select: contact.timeline ? { name: contact.timeline } : null,
          },
          'Status': {
            select: {
              name: contact.status,
            },
          },
          'Priority': {
            select: {
              name: contact.priority,
            },
          },
          'Source': {
            select: {
              name: contact.source,
            },
          },
          'Created': {
            date: {
              start: new Date().toISOString(),
            },
          },
        },
      });

      return response.id;
    } catch (error) {
      console.error('Error creating contact in Notion:', error);
      throw error;
    }
  }

  async createSubscriber(subscriber: NotionSubscriber): Promise<string> {
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: this.subscribersDbId },
        properties: {
          'Email': {
            title: [
              {
                text: {
                  content: subscriber.email,
                },
              },
            ],
          },
          'First Name': {
            rich_text: subscriber.firstName ? [
              {
                text: {
                  content: subscriber.firstName,
                },
              },
            ] : [],
          },
          'Last Name': {
            rich_text: subscriber.lastName ? [
              {
                text: {
                  content: subscriber.lastName,
                },
              },
            ] : [],
          },
          'Frequency': {
            select: {
              name: subscriber.frequency,
            },
          },
          'Interests': {
            multi_select: subscriber.interests.map(interest => ({ name: interest })),
          },
          'Status': {
            select: {
              name: subscriber.status,
            },
          },
          'Source': {
            select: {
              name: subscriber.source,
            },
          },
          'Subscribed Date': {
            date: {
              start: new Date().toISOString(),
            },
          },
          'Last Email Sent': {
            date: null,
          },
          'Unsubscribe Token': {
            rich_text: [
              {
                text: {
                  content: this.generateUnsubscribeToken(),
                },
              },
            ],
          },
        },
      });

      return response.id;
    } catch (error) {
      console.error('Error creating subscriber in Notion:', error);
      throw error;
    }
  }

  async getActiveSubscribersByFrequency(frequency: 'daily' | 'weekly' | 'monthly'): Promise<Array<{
    id: string;
    email: string;
    firstName?: string;
    unsubscribeToken: string;
  }>> {
    try {
      const response = await this.notion.databases.query({
        database_id: this.subscribersDbId,
        filter: {
          and: [
            {
              property: 'Status',
              select: {
                equals: 'active',
              },
            },
            {
              property: 'Frequency',
              select: {
                equals: frequency,
              },
            },
          ],
        },
      });

      return response.results.map((page: any) => ({
        id: page.id,
        email: page.properties.Email.title[0]?.text.content || '',
        firstName: page.properties['First Name'].rich_text[0]?.text.content,
        unsubscribeToken: page.properties['Unsubscribe Token'].rich_text[0]?.text.content || '',
      }));
    } catch (error) {
      console.error('Error fetching subscribers from Notion:', error);
      throw error;
    }
  }

  async createNewsletter(newsletter: NotionNewsletter): Promise<string> {
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: this.newslettersDbId },
        properties: {
          'Title': {
            title: [
              {
                text: {
                  content: newsletter.title,
                },
              },
            ],
          },
          'Excerpt': {
            rich_text: [
              {
                text: {
                  content: newsletter.excerpt,
                },
              },
            ],
          },
          'Topics': {
            multi_select: newsletter.topics.map(topic => ({ name: topic })),
          },
          'Status': {
            select: {
              name: newsletter.status,
            },
          },
          'Publish Date': {
            date: newsletter.publishDate ? {
              start: newsletter.publishDate,
            } : null,
          },
          'Sent Count': {
            number: newsletter.sentCount,
          },
          'Generated By': {
            select: {
              name: newsletter.generatedBy,
            },
          },
          'Created': {
            date: {
              start: new Date().toISOString(),
            },
          },
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: newsletter.content,
                  },
                },
              ],
            },
          },
        ],
      });

      return response.id;
    } catch (error) {
      console.error('Error creating newsletter in Notion:', error);
      throw error;
    }
  }

  async updateNewsletterSentCount(newsletterId: string, sentCount: number): Promise<void> {
    try {
      await this.notion.pages.update({
        page_id: newsletterId,
        properties: {
          'Sent Count': {
            number: sentCount,
          },
          'Status': {
            select: {
              name: 'published',
            },
          },
        },
      });
    } catch (error) {
      console.error('Error updating newsletter sent count in Notion:', error);
      throw error;
    }
  }

  async updateSubscriberLastEmailSent(subscriberId: string): Promise<void> {
    try {
      await this.notion.pages.update({
        page_id: subscriberId,
        properties: {
          'Last Email Sent': {
            date: {
              start: new Date().toISOString(),
            },
          },
        },
      });
    } catch (error) {
      console.error('Error updating subscriber last email sent in Notion:', error);
      throw error;
    }
  }

  async unsubscribeByToken(token: string): Promise<boolean> {
    try {
      const response = await this.notion.databases.query({
        database_id: this.subscribersDbId,
        filter: {
          property: 'Unsubscribe Token',
          rich_text: {
            equals: token,
          },
        },
      });

      if (response.results.length === 0) {
        return false;
      }

      const page = response.results[0];
      await this.notion.pages.update({
        page_id: page.id,
        properties: {
          'Status': {
            select: {
              name: 'unsubscribed',
            },
          },
        },
      });

      return true;
    } catch (error) {
      console.error('Error unsubscribing user in Notion:', error);
      throw error;
    }
  }

  private generateUnsubscribeToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Utility method to check if subscriber exists
  async subscriberExists(email: string): Promise<boolean> {
    try {
      const response = await this.notion.databases.query({
        database_id: this.subscribersDbId,
        filter: {
          property: 'Email',
          title: {
            equals: email,
          },
        },
      });

      return response.results.length > 0;
    } catch (error) {
      console.error('Error checking if subscriber exists in Notion:', error);
      return false;
    }
  }

  // Get newsletter content for AI generation context
  async getRecentNewsletters(limit: number = 5): Promise<Array<{
    title: string;
    topics: string[];
    excerpt: string;
  }>> {
    try {
      const response = await this.notion.databases.query({
        database_id: this.newslettersDbId,
        filter: {
          property: 'Status',
          select: {
            equals: 'published',
          },
        },
        sorts: [
          {
            property: 'Created',
            direction: 'descending',
          },
        ],
        page_size: limit,
      });

      return response.results.map((page: any) => ({
        title: page.properties.Title.title[0]?.text.content || '',
        topics: page.properties.Topics.multi_select.map((topic: any) => topic.name),
        excerpt: page.properties.Excerpt.rich_text[0]?.text.content || '',
      }));
    } catch (error) {
      console.error('Error fetching recent newsletters from Notion:', error);
      return [];
    }
  }
}
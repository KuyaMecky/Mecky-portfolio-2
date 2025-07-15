import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import ContactMessage, ContactMessageCreate, ContactMessageResponse
import logging
import os

logger = logging.getLogger(__name__)

class ContactService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.admin_email = os.getenv("ADMIN_EMAIL", "Tallada88@gmail.com")
        
    async def create_contact_message(self, message_data: ContactMessageCreate, ip_address: Optional[str] = None) -> ContactMessageResponse:
        """Create and store a new contact message"""
        try:
            # Create contact message
            contact_message = ContactMessage(
                **message_data.dict(),
                ip_address=ip_address
            )
            
            # Store in database
            await self.db.contact_messages.insert_one(contact_message.dict())
            
            # Send email notification (optional)
            await self._send_email_notification(contact_message)
            
            return ContactMessageResponse(
                success=True,
                message="Your message has been sent successfully! I'll get back to you soon.",
                contact_id=contact_message.id
            )
            
        except Exception as e:
            logger.error(f"Error creating contact message: {str(e)}")
            return ContactMessageResponse(
                success=False,
                message="There was an error sending your message. Please try again later."
            )
    
    async def get_contact_messages(self, limit: int = 50, skip: int = 0) -> list[ContactMessage]:
        """Get contact messages (for admin purposes)"""
        try:
            cursor = self.db.contact_messages.find().sort("timestamp", -1).skip(skip).limit(limit)
            messages = await cursor.to_list(length=limit)
            return [ContactMessage(**msg) for msg in messages]
        except Exception as e:
            logger.error(f"Error fetching contact messages: {str(e)}")
            return []
    
    async def mark_message_as_read(self, message_id: str) -> bool:
        """Mark a contact message as read"""
        try:
            result = await self.db.contact_messages.update_one(
                {"id": message_id},
                {"$set": {"status": "read"}}
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Error marking message as read: {str(e)}")
            return False
    
    async def _send_email_notification(self, message: ContactMessage) -> bool:
        """Send email notification for new contact message"""
        try:
            if not all([self.smtp_username, self.smtp_password]):
                logger.warning("SMTP credentials not configured. Skipping email notification.")
                return False
            
            # Create email message
            msg = MIMEMultipart()
            msg['From'] = self.smtp_username
            msg['To'] = self.admin_email
            msg['Subject'] = f"New Contact Form Message: {message.subject}"
            
            # Email body
            body = f"""
            New contact form message received:
            
            Name: {message.name}
            Email: {message.email}
            Subject: {message.subject}
            Message: {message.message}
            
            Timestamp: {message.timestamp}
            IP Address: {message.ip_address}
            Message ID: {message.id}
            """
            
            msg.attach(MIMEText(body, 'plain'))
            
            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            text = msg.as_string()
            server.sendmail(self.smtp_username, self.admin_email, text)
            server.quit()
            
            logger.info(f"Email notification sent for contact message {message.id}")
            return True
            
        except Exception as e:
            logger.error(f"Error sending email notification: {str(e)}")
            return False
    
    async def get_contact_stats(self) -> dict:
        """Get contact message statistics"""
        try:
            total_messages = await self.db.contact_messages.count_documents({})
            new_messages = await self.db.contact_messages.count_documents({"status": "new"})
            read_messages = await self.db.contact_messages.count_documents({"status": "read"})
            
            # Recent messages (last 30 days)
            thirty_days_ago = datetime.utcnow() - timedelta(days=30)
            recent_messages = await self.db.contact_messages.count_documents({
                "timestamp": {"$gte": thirty_days_ago}
            })
            
            return {
                "total_messages": total_messages,
                "new_messages": new_messages,
                "read_messages": read_messages,
                "recent_messages": recent_messages
            }
            
        except Exception as e:
            logger.error(f"Error getting contact stats: {str(e)}")
            return {
                "total_messages": 0,
                "new_messages": 0,
                "read_messages": 0,
                "recent_messages": 0
            }
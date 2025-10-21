import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useNotifications } from '@/hooks/useNotifications';
import { getNotificationMessage } from '@/lib/notifications';

export default function NotificationsPanel() {
	// session is intentionally unused here; user info is not required in this component
	const { notifications, unreadCount, loading, markAsRead } = useNotifications();
	const [isOpen, setIsOpen] = useState(false);

	const handleNotificationClick = () => {
		setIsOpen(!isOpen);
			if (!isOpen && unreadCount > 0) {
				notifications
					.filter((n) => !n.read)
					.forEach((n) => markAsRead([n.id]));
			}
	};

	return (
		<div className="relative">
			<button
				onClick={handleNotificationClick}
				className="relative p-2 hover:bg-gray-100 rounded-full"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
					/>
				</svg>
				{unreadCount > 0 && (
					<span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
						{unreadCount}
					</span>
				)}
			</button>
			{isOpen && (
				<div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50">
					<div className="p-4 border-b border-gray-200">
						<h3 className="text-lg font-semibold">Notifications</h3>
					</div>
					<div className="max-h-96 overflow-y-auto">
						{loading ? (
							<div className="p-4 text-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
							</div>
						) : notifications.length === 0 ? (
							<div className="p-4 text-center text-gray-500">No notifications yet</div>
						) : (
							<div className="divide-y divide-gray-200">
								{notifications.map((notification) => (
									<div
										key={notification.id}
										className={`block p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
									>
										<div className="flex items-start space-x-3">
											{notification.creator?.image && (
												<Image
													src={notification.creator.image}
													alt={notification.creator.name || 'User'}
													width={32}
													height={32}
													className="rounded-full"
												/>
											)}
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-gray-900">
													{getNotificationMessage(notification)}
												</p>
												<p className="text-xs text-gray-500">
													{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

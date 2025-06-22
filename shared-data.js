// ملف البيانات المشتركة بين لوحات التحكم
class SharedDataManager {
    constructor() {
        this.data = {
            users: {
                'admin': { password: 'admin123', role: 'admin', fullName: 'أحمد محمد', status: 'online' },
                'tester1': { password: 'pass123', role: 'tester', fullName: 'سارة أحمد', status: 'online' },
                'ahmed': { password: '123456', role: 'member', fullName: 'أحمد علي', status: 'busy' },
                'sara': { password: 'sara123', role: 'member', fullName: 'فاطمة حسن', status: 'online' },
                'mohamed': { password: 'test2024', role: 'member', fullName: 'محمد خالد', status: 'offline' }
            },
            visitors: [],
            messages: [],
            stats: {
                totalVisitors: 12,
                newVisitors: 4,
                activeChats: 7,
                totalMessages: 143,
                onlineMembers: 8,
                onlineAdmins: 3,
                onlineVisitors: 5
            },
            systemInfo: {
                uptime: '99.9%',
                responseTime: '45ms',
                serverLoad: '12%'
            }
        };
        
        this.listeners = [];
        this.loadFromStorage();
    }

    // حفظ البيانات في التخزين المحلي
    saveToStorage() {
        try {
            localStorage.setItem('testTeamData', JSON.stringify(this.data));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    }

    // تحميل البيانات من التخزين المحلي
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('testTeamData');
            if (saved) {
                const parsedData = JSON.parse(saved);
                this.data = { ...this.data, ...parsedData };
            }
        } catch (e) {
            console.warn('Could not load from localStorage:', e);
        }
    }

    // إضافة مستمع للتغييرات
    addListener(callback) {
        this.listeners.push(callback);
    }

    // إشعار جميع المستمعين بالتغييرات
    notifyListeners(type, data) {
        this.listeners.forEach(callback => {
            try {
                callback(type, data);
            } catch (e) {
                console.error('Error in listener:', e);
            }
        });
    }

    // إضافة مستخدم جديد
    addUser(username, userData) {
        this.data.users[username] = userData;
        this.saveToStorage();
        this.notifyListeners('userAdded', { username, userData });
    }

    // إضافة زائر
    addVisitor(visitorData) {
        this.data.visitors.push({
            ...visitorData,
            id: Date.now(),
            joinTime: new Date().toISOString()
        });
        this.data.stats.totalVisitors++;
        this.data.stats.onlineVisitors++;
        this.saveToStorage();
        this.notifyListeners('visitorAdded', visitorData);
    }

    // إضافة رسالة
    addMessage(messageData) {
        const message = {
            ...messageData,
            id: Date.now(),
            timestamp: new Date().toISOString()
        };
        this.data.messages.push(message);
        this.data.stats.totalMessages++;
        this.saveToStorage();
        this.notifyListeners('messageAdded', message);
        return message;
    }

    // تحديث الإحصائيات
    updateStats(newStats) {
        this.data.stats = { ...this.data.stats, ...newStats };
        this.saveToStorage();
        this.notifyListeners('statsUpdated', this.data.stats);
    }

    // تحديث حالة المستخدم
    updateUserStatus(username, status) {
        if (this.data.users[username]) {
            this.data.users[username].status = status;
            this.saveToStorage();
            this.notifyListeners('userStatusUpdated', { username, status });
        }
    }

    // الحصول على البيانات
    getData() {
        return this.data;
    }

    // الحصول على الرسائل الحديثة
    getRecentMessages(limit = 50) {
        return this.data.messages.slice(-limit);
    }

    // الحصول على المستخدمين المتصلين
    getOnlineUsers() {
        return Object.entries(this.data.users)
            .filter(([_, user]) => user.status === 'online')
            .map(([username, user]) => ({ username, ...user }));
    }

    // محاكاة تحديث البيانات في الوقت الفعلي
    startRealTimeUpdates() {
        setInterval(() => {
            // تحديث الإحصائيات بشكل عشوائي
            const stats = { ...this.data.stats };
            
            if (Math.random() > 0.7) {
                stats.totalVisitors += Math.random() > 0.5 ? 1 : 0;
                stats.onlineVisitors = Math.max(3, Math.min(15, stats.onlineVisitors + (Math.random() > 0.5 ? 1 : -1)));
                stats.onlineMembers = Math.max(5, Math.min(12, stats.onlineMembers + (Math.random() > 0.5 ? 1 : -1)));
                
                this.updateStats(stats);
            }

            // إضافة رسائل تلقائية أحياناً
            if (Math.random() > 0.9) {
                const adminMessages = [
                    'مرحباً بالجميع!',
                    'هل يحتاج أحد للمساعدة؟',
                    'نحن متواجدون للإجابة على استفساراتكم',
                    'شكراً لتفاعلكم معنا'
                ];
                
                const randomMessage = adminMessages[Math.floor(Math.random() * adminMessages.length)];
                this.addMessage({
                    type: 'admin',
                    sender: 'أدمين أحمد',
                    content: randomMessage,
                    target: 'all'
                });
            }
        }, 5000);
    }
}

// إنشاء مثيل مشترك
window.sharedDataManager = new SharedDataManager();

// بدء التحديثات في الوقت الفعلي
window.sharedDataManager.startRealTimeUpdates();
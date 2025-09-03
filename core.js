let selectedSubjects = [];
        let exchanges = [];
        let clickCount = 0;

        function selectSubject(element, subject, time) {
            if (clickCount < 2) {
                // Remove previous selection highlighting
                document.querySelectorAll('.schedule-table td.selected').forEach(td => {
                    td.classList.remove('selected');
                });
                
                // Highlight current selection
                element.classList.add('selected');
                
                clickCount++;
                
                if (clickCount === 1) {
                    // First click - subject to exchange out
                    selectedSubjects[0] = { subject, time };
                    const subject1Box = document.getElementById('subject1');
                    subject1Box.innerHTML = `${subject} (${time})`;
                    subject1Box.className = 'exchange-box filled';
                    
                    // Add success sound effect (visual feedback)
                    element.style.animation = 'selectedPulse 0.6s ease-out';
                } else if (clickCount === 2) {
                    // Second click - subject to exchange in
                    selectedSubjects[1] = { subject, time };
                    const subject2Box = document.getElementById('subject2');
                    subject2Box.innerHTML = `${subject} (${time})`;
                    subject2Box.className = 'exchange-box filled';
                    
                    // Enable submit button with animation
                    const submitBtn = document.getElementById('submitBtn');
                    submitBtn.disabled = false;
                    submitBtn.style.animation = 'fillAnimation 0.5s ease-out';
                    
                    // Add completion effect
                    element.style.animation = 'selectedPulse 0.6s ease-out';
                }
            }
        }

        function submitExchange() {
            if (selectedSubjects.length === 2) {
                const exchange = {
                    id: Date.now(),
                    from: selectedSubjects[0],
                    to: selectedSubjects[1],
                    timestamp: new Date().toLocaleString('th-TH')
                };
                fetch("https://api.emailjs.com/api/v1.0/email/send-form", {
                  "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryxTqkJkyInv1cw3B3",
                    "priority": "u=1, i",
                    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site"
                  },
                  "referrer": "https://fiddle.jshell.net/",
                  "body": "------WebKitFormBoundaryxTqkJkyInv1cw3B3\r\nContent-Disposition: form-data; name=\"lib_version\"\r\n\r\n4.4.1\r\n------WebKitFormBoundaryxTqkJkyInv1cw3B3\r\nContent-Disposition: form-data; name=\"service_id\"\r\n\r\ndefault_service\r\n------WebKitFormBoundaryxTqkJkyInv1cw3B3\r\nContent-Disposition: form-data; name=\"template_id\"\r\n\r\ntemplate_yrrabym\r\n------WebKitFormBoundaryxTqkJkyInv1cw3B3\r\nContent-Disposition: form-data; name=\"user_id\"\r\n\r\nR_Em6r66kOjspcFUv\r\n------WebKitFormBoundaryxTqkJkyInv1cw3B3--\r\n",
                  "method": "POST",
                  "mode": "cors",
                  "credentials": "omit"
                });

                // เพิ่มการแลกเปลี่ยนลงในรายการ
                exchanges.push(exchange);
                updateResultDisplay();
                resetSelection();
                
                // แสดงข้อความแจ้งเตือน
                showNotification("&#9989; &#3610;&#3633;&#3609;&#3607;&#3638;&#3585;&#3585;&#3634;&#3619;&#3649;&#3621;&#3585;&#3648;&#3627;&#3621;&#3637;&#3618;&#3609;&#3648;&#3619;&#3637;&#3618;&#3610;&#3619;&#3657;&#3629;&#3618;&#3648;&#3619;&#3637;&#3618;&#3610;!", "success");
            }
        }

        function resetSelection() {
            selectedSubjects = [];
            clickCount = 0;
            
            // Clear highlighting
            document.querySelectorAll('.schedule-table td.selected').forEach(td => {
                td.classList.remove('selected');
                td.style.animation = '';
            });
            
            // Reset exchange boxes with animation
            const subject1Box = document.getElementById('subject1');
            const subject2Box = document.getElementById('subject2');
            
            subject1Box.style.animation = 'fillAnimation 0.3s ease-out reverse';
            subject2Box.style.animation = 'fillAnimation 0.3s ease-out reverse';
            
            setTimeout(() => {
                subject1Box.innerHTML = '&#3585;&#3619;&#3640;&#3603;&#3634;&#3648;&#3621;&#3639;&#3629;&#3585;&#3623;&#3636;&#3594;&#3634;&#3592;&#3634;&#3586;&#3605;&#3634;&#3619;&#3634;&#3591;&#3648;&#3619;&#3637;&#3618;&#3609;';
                subject1Box.className = 'exchange-box empty';
                
                subject2Box.innerHTML = '&#3585;&#3619;&#3640;&#3603;&#3634;&#3648;&#3621;&#3639;&#3629;&#3585;&#3623;&#3636;&#3594;&#3634;&#3592;&#3634;&#3586;&#3605;&#3634;&#3619;&#3634;&#3591;&#3648;&#3619;&#3637;&#3618;&#3609;';
                subject2Box.className = 'exchange-box empty';
                
                subject1Box.style.animation = '';
                subject2Box.style.animation = '';
            }, 150);
            
            // Disable submit button
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.style.animation = '';
        }

        function cancelExchange(exchangeId) {
            // แสดง confirmation dialog with modern styling
            if (confirm('&#128465; &#3588;&#3640;&#3603;&#3605;&#3657;&#3629;&#3591;&#3585;&#3634;&#3619;&#3618;&#3585;&#3648;&#3621;&#3636;&#3585;&#3585;&#3634;&#3619;&#3649;&#3621;&#3585;&#3648;&#3627;&#3621;&#3637;&#3618;&#3609;&#3609;&#3637;&#3657;&#3627;&#3619;&#3639;&#3629;&#3652;&#3617;&#3656;')) {
                // ลบรายการแลกเปลี่ยนที่มี ID ตรงกัน
                exchanges = exchanges.filter(exchange => exchange.id !== exchangeId);
                updateResultDisplay();
                showNotification("&#128465; &#3618;&#3586;&#3648;&#3621;&#3636;&#3585;&#3585;&#3634;&#3619;&#3649;&#3621;&#3585;&#3648;&#3627;&#3621;&#3637;&#3618;&#3609;&#3648;&#3619;&#3637;&#3618;&#3610;&#3619;&#3657;&#3629;&#3618;", "info");
            }
        }

        function clearAllExchanges() {
            if (confirm('&#128465; &#3588;&#3640;&#3603;&#3605;&#3657;&#3629;&#3591;&#3585;&#3634;&#3619;&#3621;&#3657;&#3634;&#3591;&#3611;&#3619;&#3633;&#3623;&#3633;&#3605;&#3636;&#3585;&#3634;&#3619;&#3649;&#3621;&#3585;&#3648;&#3627;&#3621;&#3637;&#3618;&#3609;&#3607;&#3633;&#3657;&#3591;&#3627;&#3617;&#3604;&#3627;&#3619;&#3639;&#3629;&#3652;&#3617;&#3656;')) {
                exchanges = [];
                updateResultDisplay();
                showNotification("&#128465; &#3621;&#3657;&#3634;&#3591;&#3611;&#3619;&#3633;&#3623;&#3633;&#3605;&#3636;&#3607;&#3633;&#3657;&#3591;&#3627;&#3617;&#3604;&#3648;&#3619;&#3637;&#3618;&#3610;&#3619;&#3657;&#3629;&#3618;", "info");
            }
        }

        function updateResultDisplay() {
            const resultArea = document.getElementById('resultArea');
            const clearAllBtn = document.getElementById('clearAllBtn');
            
            if (exchanges.length === 0) {
                resultArea.innerHTML = '<div class="result-empty">&#3621;&#3633;&#3591;&#3652;&#3617;&#3656;&#3617;&#3637;&#3585;&#3634;&#3619;&#3649;&#3621;&#3585;&#3648;&#3627;&#3621;&#3637;&#3618;&#3609;&#3588;&#3634;&#3610;&#3648;&#3619;&#3637;&#3618;&#3609;</div>';
                clearAllBtn.disabled = true;
                return;
            }
            
            clearAllBtn.disabled = false;
            
            let html = '';
            exchanges.forEach((exchange, index) => {
                html += `
                    <div class="result-item" style="animation-delay: ${index * 0.1}s">
                        <button class="cancel-btn" onclick="cancelExchange(${exchange.id})" title="&#3618;&#3586;&#3648;&#3621;&#3636;&#3585;&#3585;&#3634;&#3619;&#3649;&#3621;&#3585;&#3648;&#3627;&#3621;&#3637;&#3618;&#3609;">
                            ×
                        </button>
                        <strong>&#128260; &#3585;&#3634;&#3619;&#3649;&#3621;&#3585;&#3648;&#3627;&#3621;&#3637;&#3618;&#3609;&#3607;&#3637;&#3656; ${index + 1}</strong><br>
                        <span style="color: #f97316; font-weight: 600;">&#128228; &#3649;&#3621;&#3585;&#3629;&#3629;&#3585;:</span> ${exchange.from.subject} (${exchange.from.time})<br>
                        <span style="color: #2dd4bf; font-weight: 600;">&#128229; &#3649;&#3621;&#3585;&#3648;&#3586;&#3657;&#3634;:</span> ${exchange.to.subject} (${exchange.to.time})<br>
                        <small style="color: #64748b; font-weight: 400;">&#9200; &#3648;&#3623;&#3621;&#3634;: ${exchange.timestamp}</small>
                    </div>
                `;
            });
            
            resultArea.innerHTML = html;
        }

        function showNotification(message, type) {
            // Create notification element
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                border-radius: 12px;
                color: white;
                font-weight: 600;
                font-size: 14px;
                z-index: 1000;
                transform: translateX(100%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                max-width: 300px;
            `;
            
            // Set background based on type
            switch(type) {
                case 'success':
                    notification.style.background = 'linear-gradient(135deg, #2dd4bf, #14b8a6)';
                    break;
                case 'error':
                    notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                    break;
                case 'info':
                    notification.style.background = 'linear-gradient(135deg, #2dd4bf, #0d9488)';
                    break;
            }
            
            notification.innerHTML = message;
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Animate out and remove
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // Add some interactive effects on page load
        document.addEventListener('DOMContentLoaded', function() {
            // Animate table rows on load
            const rows = document.querySelectorAll('.schedule-table tbody tr');
            rows.forEach((row, index) => {
                row.style.opacity = '0';
                row.style.transform = 'translateY(20px)';
                row.style.animation = `slideInLeft 0.6s ease-out ${index * 0.1}s forwards`;
            });
            
            // Add hover effects to cells
            const cells = document.querySelectorAll('.schedule-table td:not(.day-slot):not(.lunch-break)');
            cells.forEach(cell => {
                cell.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-4px) scale(1.02)';
                });
                
                cell.addEventListener('mouseleave', function() {
                    if (!this.classList.contains('selected')) {
                        this.style.transform = '';
                    }
                });
            });
        });

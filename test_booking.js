
async function testBooking() {
    try {
        const stRes = await fetch("http://localhost:8080/api/showtimes");
        const showtimes = await stRes.json();
        
        let targetSt = null;
        let seat1 = null, seat2 = null;

        for (const st of showtimes) {
            const seatRes = await fetch(`http://localhost:8080/api/seats/showtime-seats?showtimeId=${st.id}`);
            const seats = await seatRes.json();
            // In DB, ss.status is the ShowtimeSeat status!
            const availableSeats = seats.filter(s => s.status === 'AVAILABLE');
            
            if (availableSeats.length >= 2) {
                targetSt = st;
                seat1 = availableSeats[0].seat.id;
                seat2 = availableSeats[1].seat.id;
                break;
            }
        }

        if (!targetSt) {
            console.log("No showtime with >= 2 seats");
            return;
        }

        console.log(`Booking seats ${seat1}, ${seat2} for showtime ${targetSt.id}`);
        
        const req = {
            userId: 3, 
            showtimeId: targetSt.id,
            seatIds: [seat1, seat2],
            paymentMethod: "CASH",
            foodTotal: 0,
            discountAmount: 0
        };

        const res = await fetch("http://localhost:8080/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req)
        });

        const text = await res.text();
        console.log("Response:", res.status, text);

    } catch (err) {
        console.error(err);
    }
}

testBooking();

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("bookingForm");
    const table = document.getElementById("bookingTable");
    const bookingId = document.getElementById("bookingId");

    async function loadBookings() {
        const res = await fetch("/api/bookings");
        const data = await res.json();

        table.innerHTML = "";

        data.forEach(b => {
            table.innerHTML += `
                <tr>
                    <td>${b.customerName}</td>
                    <td>${b.busType}</td>
                    <td>${b.seats}</td>
                    <td>₹${b.totalPrice}</td>
                    <td>
                        <button class="action-btn edit"
                            onclick="editBooking('${b._id}','${b.customerName}','${b.busType}',${b.seats})">
                            Edit
                        </button>
                        <button class="action-btn delete"
                            onclick="deleteBooking('${b._id}')">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const data = {
            customerName: customerName.value,
            busType: busType.value,
            seats: seats.value
        };

        if (bookingId.value) {
            await fetch(`/api/bookings/${bookingId.value}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        } else {
            await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        }

        form.reset();
        bookingId.value = "";
        loadBookings();
    });

    window.editBooking = (id, name, type, seatCount) => {
        bookingId.value = id;
        customerName.value = name;
        busType.value = type;
        seats.value = seatCount;
    };

    window.deleteBooking = async id => {
        await fetch(`/api/bookings/${id}`, { method: "DELETE" });
        loadBookings();
    };

    loadBookings();
});

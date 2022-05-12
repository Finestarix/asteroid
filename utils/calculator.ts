export const calculateDeliveryPrice = (totalParticipant: number) => {

    const deliveryPriceRange = [
        {minimumParticipant: 1, maximumParticipant: 5, deliveryPrice: 5000},
        {minimumParticipant: 6, maximumParticipant: 10, deliveryPrice: 4000},
        {minimumParticipant: 11, maximumParticipant: 15, deliveryPrice: 3000},
        {minimumParticipant: 16, maximumParticipant: Number.MAX_SAFE_INTEGER, deliveryPrice: 2000}
    ];

    let rangeIndex = -1;
    deliveryPriceRange.forEach((data, index) => {
        if (data.minimumParticipant <= totalParticipant && data.maximumParticipant >= totalParticipant) {
            rangeIndex = index;
        }
    });

    return deliveryPriceRange[rangeIndex].deliveryPrice;
};

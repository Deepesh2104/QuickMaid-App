import { FEATURED_SERVICES, HOME_SERVICES, type ServiceItem } from '@/constants/services';
import { useCheckout } from '@/context/CheckoutContext';

export function useStartBooking() {
  const { startCheckout } = useCheckout();

  const bookService = (service: ServiceItem) => {
    void startCheckout(service);
  };

  const bookById = (id: string) => {
    const service =
      HOME_SERVICES.find((s) => s.id === id) ??
      FEATURED_SERVICES.find((s) => s.id === id);
    if (service) void startCheckout(service);
  };

  const bookDefault = () => {
    const service = HOME_SERVICES.find((s) => s.id === 'regular') ?? HOME_SERVICES[0];
    if (service) void startCheckout(service);
  };

  return { bookService, bookById, bookDefault };
}

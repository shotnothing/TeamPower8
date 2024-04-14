from django.test import TestCase

class TestViews(TestCase):
    def test_test(self):
        response = self.client.get('/api/test/')
        self.assertEqual(response.status_code, 200)

    def test_route_get_product_info(self):
        response = self.client.get('/api/product/p/1/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['product_id'], 1)

    def test_route_get_product_filter_company(self):
        response = self.client.get('/api/product/filter/?company=mflg')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['products']), 6)

    def test_route_get_product_filter_range(self):
        response = self.client.get('/api/product/filter/?from=10&to=19')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['products']), 10)

    def test_route_get_product_filter_name(self):
        response = self.client.get('/api/product/filter/?company=mflg')
        self.assertEqual(response.status_code, 200)


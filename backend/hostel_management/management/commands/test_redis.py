import time
from django.core.management.base import BaseCommand
from django.core.cache import cache
from django.conf import settings
import redis


class Command(BaseCommand):
    help = 'Test Redis connectivity and functionality'

    def add_arguments(self, parser):
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Show detailed output',
        )

    def handle(self, *args, **options):
        verbose = options['verbose']
        
        self.stdout.write(self.style.HTTP_INFO('Testing Redis connectivity...'))
        
        try:
            # Test 1: Django cache (using django-redis)
            self.stdout.write('1. Testing Django cache (django-redis)...')
            
            test_key = 'redis_test_key'
            test_value = {'message': 'Hello Redis!', 'timestamp': time.time()}
            
            # Set cache
            cache.set(test_key, test_value, 60)
            self.stdout.write(self.style.SUCCESS('   ✓ Cache set successful'))
            
            # Get cache
            cached_value = cache.get(test_key)
            if cached_value and cached_value['message'] == test_value['message']:
                self.stdout.write(self.style.SUCCESS('   ✓ Cache get successful'))
                if verbose:
                    self.stdout.write(f'     Retrieved: {cached_value}')
            else:
                self.stdout.write(self.style.ERROR('   ✗ Cache get failed'))
                return
            
            # Delete cache
            cache.delete(test_key)
            if cache.get(test_key) is None:
                self.stdout.write(self.style.SUCCESS('   ✓ Cache delete successful'))
            else:
                self.stdout.write(self.style.ERROR('   ✗ Cache delete failed'))

            # Test 2: Direct Redis connection
            self.stdout.write('\n2. Testing direct Redis connection...')
            
            redis_url = getattr(settings, 'REDIS_URL', 'redis://redis:6379/0')
            if verbose:
                self.stdout.write(f'   Using Redis URL: {redis_url}')
            
            # Connect to Redis
            r = redis.from_url(redis_url)
            
            # Test ping
            if r.ping():
                self.stdout.write(self.style.SUCCESS('   ✓ Redis ping successful'))
            else:
                self.stdout.write(self.style.ERROR('   ✗ Redis ping failed'))
                return
            
            # Test set/get
            r.set('direct_test', 'direct_value', ex=60)
            value = r.get('direct_test')
            if value and value.decode('utf-8') == 'direct_value':
                self.stdout.write(self.style.SUCCESS('   ✓ Direct Redis set/get successful'))
            else:
                self.stdout.write(self.style.ERROR('   ✗ Direct Redis set/get failed'))
                return
            
            # Clean up
            r.delete('direct_test')
            
            # Test 3: Redis info
            if verbose:
                self.stdout.write('\n3. Redis server info:')
                info = r.info()
                self.stdout.write(f'   Redis version: {info.get("redis_version")}')
                self.stdout.write(f'   Connected clients: {info.get("connected_clients")}')
                self.stdout.write(f'   Used memory: {info.get("used_memory_human")}')
                self.stdout.write(f'   Total commands processed: {info.get("total_commands_processed")}')
            
            self.stdout.write(self.style.SUCCESS('\n🎉 All Redis tests passed successfully!'))
            
        except redis.ConnectionError as e:
            self.stdout.write(self.style.ERROR(f'Redis connection failed: {e}'))
            self.stdout.write('Make sure Redis service is running and accessible.')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Redis test failed with error: {e}'))
            if verbose:
                import traceback
                traceback.print_exc()

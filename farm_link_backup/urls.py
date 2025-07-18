from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('trading.urls')),
    # React SPA fallback for all non-API, non-admin, non-static/media routes
    re_path(
        r'^(?!api/|admin/|static/|media/).*$', 
        TemplateView.as_view(template_name='index.html')
    ),
]
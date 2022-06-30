from import_export import resources
from .models import Photo


class PhotoResource(resources.ModelResource):

    class Meta:
        model = Photo
        fields = ('foreignUrl', 'created')
        export_order = ('foreignUrl', 'created')

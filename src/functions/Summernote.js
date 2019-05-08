module.exports = {

    template: '<textarea class="testingnotesummer" :name="name"></textarea>',

    props: {
        model: {
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        height: {
            type: String,
            default: '300'
        }
    },

    mounted() {

    
        let config = {
            height: this.height,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                // ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'picture']],
                ['view', ['fullscreen', 'codeview']],
                ['help', ['help']]
            ],
            popover: {
                image: [
                    ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
                    ['float', ['floatLeft', 'floatRight', 'floatNone']],
                    ['remove', ['removeMedia']]
                ],
                link: [
                    ['link', ['linkDialogShow', 'unlink']]
                ],
                air: [
                    ['color', ['color']],
                    ['font', ['bold', 'underline', 'clear']],
                    ['para', ['ul', 'paragraph']],
                    ['table', ['table']],
                    ['insert', ['link', 'picture']]
                ]
            }
        };

        let vm = this;

        config.callbacks = {

            onInit: function () {
                $(vm.$el).summernote("code", vm.model);
            },

            onChange: function () {
                vm.$emit('change', $(vm.$el).summernote('code'));
            },

            onBlur: function () {
                vm.$emit('change', $(vm.$el).summernote('code'));
            }
        };

        $(this.$el).summernote(config);

    },

}

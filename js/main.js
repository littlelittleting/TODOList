(function() {
    'use strict'

    var Event = new Vue()

    Vue.component('task', {
        template: '#task-tpl',
        props: ['todo'],
        methods:{
            action: function(name, params) {
                Event.$emit(name, params)
            }
        }
    })

    new Vue({
        el: '#main',
        data: {
            list: [],
            current: {},
        },


        mounted: function() {
            var me = this

            this.list = ms.get('list') || this.list

            // 提醒功能  每隔 1s 执行一次
            setInterval(function(){
                me.check_alerts()
            }, 1000)

            Event.$on('remove', function(id) {
                if(id) {
                    me.remove(id)
                }
            })
            Event.$on('toggle_complete', function(id) {
                if(id) {
                    me.toggle_complete(id)
                }
            })
            Event.$on('set_current', function(id) {
                if(id) {
                    me.set_current(id)
                }
            })


        },


        methods: {
            // 提醒功能
            check_alerts: function() {
                var me = this
                this.list.forEach(function(row, i) {
                    // console.log('row', row)
                    var alert_at = row.alert_at
                    if(!alert_at || row.alert_confirmed) {
                        return
                    }
                    var alert_at = (new Date(alert_at)).getTime()
                    var now = (new Date()).getTime()
                    if(now >= alert_at) {
                        var confirmed = confirm(row.title)
                        Vue.set(me.list[i], 'alert_confirmed', confirmed)
                    }
                })

            },

            merge: function() {
                // console.log('this.current:', this.current);
                var is_update, id
                is_update = id = this.current.id
                if(is_update) {

                    var index = this.find_index(id)
                    Vue.set(this.list, index, Object.assign({}, this.current))

                } else {
                    var title = this.current.title
                    if(!title && title !== 0) {
                        return
                    }
                    var todo = Object.assign({}, this.current)
                    todo.id = this.next_id()
                    this.list.push(todo)
                    // console.log('this.list', this.list);
                }

                this.reset_current()
            },


            remove: function(id) {
                var index = this.find_index(id)
                this.list.splice(index, 1)
            },

            next_id: function() {
                return this.list.length + 1
            },

            set_current: function(todo) {
                this.current = Object.assign({}, todo)
            },

            reset_current: function() {
                this.set_current({})
            },

            find_index: function(id) {
                return this.list.findIndex(function(item) {
                    return item.id == id
                })
            },

            toggle_complete: function(id) {
                // 找到这条todo的索引
                var i = this.find_index(id)
                console.log('completed', this.list[i].completed);
                Vue.set(this.list[i], 'completed', !this.list[i].completed)
            }
        },

        watch: {
            list: {
                deep: true,
                handler: function(n, o) {
                    if(n) {
                        ms.set('list', n)
                    } else {
                        ms.set('list', [])
                    }
                },
            },
        },


    })
})()
